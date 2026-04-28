@echo off
echo ===================================
echo Smart Ambulance System - Backend Setup
echo ===================================
echo.

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo ===================================
echo Setup completed successfully!
echo ===================================
echo.
echo To create superuser, run:
echo python manage.py createsuperuser
echo.
echo To start the server, run:
echo python manage.py runserver
echo.
pause
