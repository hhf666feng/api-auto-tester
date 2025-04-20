import uvicorn
from src.main import app
from src.db.base_class import Base
from src.db.session import engine

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True) 