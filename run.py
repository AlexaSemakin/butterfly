import os
import uvicorn

if __name__ == '__main__':
    print(os.getcwd())
    uvicorn.run('backend.main:app', reload=True)
