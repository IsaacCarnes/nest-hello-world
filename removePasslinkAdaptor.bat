
@echo off
REM the service is already installed, remove it before continuing
ECHO Removing existing PasslinkAdaptor.Service...
nssm.exe stop "PasslinkAdaptor.Service"
nssm.exe remove "PasslinkAdaptor.Service" confirm
:Done