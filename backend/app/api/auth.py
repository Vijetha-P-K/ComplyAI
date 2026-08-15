from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.models.database import get_db
from app.models.models import User
from app.schemas.schemas import Token, UserCreate, UserLogin, UserOut
from app.services.activity import log_activity

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    user = User(
        full_name=payload.full_name,
        email=payload.email.lower(),
        company=payload.company,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    log_activity(db, user.id, "account_created", f"Account created for {user.email}")
    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    log_activity(db, user.id, "login", f"{user.email} logged in")
    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login/form", response_model=Token, include_in_schema=False)
def login_form(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login(UserLogin(email=form.username, password=form.password), db)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
