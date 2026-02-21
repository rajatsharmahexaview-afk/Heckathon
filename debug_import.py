import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

try:
    from app.main import app
    print("App imported successfully")
except Exception as e:
    import traceback
    traceback.print_exc()
