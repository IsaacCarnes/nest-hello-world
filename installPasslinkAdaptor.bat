
@echo off
REM Saurabh: 12/07/2023 : for installing PassLink Adaptor as Window Service on Windows based Platform
REM First argument is PassLink Adaptor root 
IF [%1]==[] (GOTO SequenceHelper) ELSE GOTO SequenceInit

REM Check if the service is already installed
SC QUERY "PasslinkAdaptor.Service" > NUL
IF ERRORLEVEL 1060 (GOTO Install) ELSE GOTO Remove

:SequenceHelper
ECHO syntax: installPasslinkAdaptor.bat {PassLinkAdaptor folder location} 
GOTO Done

:SequenceInit
ECHO sequence init for InstallPasslinkAdaptor.bat 
ECHO arg{0} PassLinkAdaptor root location - "%1"

:Remove
REM the service is already installed, remove it before continuing
ECHO Removing existing PasslinkAdaptor.Service...
"%1"\nssm.exe stop "PasslinkAdaptor.Service"
"%1"\nssm.exe remove "PasslinkAdaptor.Service" confirm

:Install
ECHO Installing PasslinkAdaptor.Service...
"%1"\nssm.exe install "PasslinkAdaptor.Service" "%1"\node.exe passlink.adaptor.js"

ECHO setting up service configuration...
"%1"\nssm.exe set PasslinkAdaptor.Service Description "Passlink Adaptor Service" 
SC CONFIG PasslinkAdaptor.Service start=delayed-auto

ECHO setting up log configuration...
if not exist "%1"\passlink-adaptor-logs mkdir "%1"\passlink-adaptor-logs\
"%1"\nssm.exe set PasslinkAdaptor.Service AppStdout "%1"\passlink-adaptor-logs\install.log
"%1"\nssm.exe set PasslinkAdaptor.Service AppStderr "%1"\passlink-adaptor-logs\install.log

ECHO Starting PasslinkAdaptor.Service...
"%1"\nssm.exe start "PasslinkAdaptor.Service"
if %errorlevel% neq 0 exit /b
:Done