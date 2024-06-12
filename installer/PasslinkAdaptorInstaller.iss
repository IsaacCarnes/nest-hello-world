#define CopyrightYear GetDateTimeString('yyyy', '', '');
#define WSTSDFVersion ("DF-XXXXXX Rev 01") 
#define WSTSVersion ("1.0.0.1") 
#define WSTSDNVersion ("DF-XXXXXX Rev 01") 

[Setup]
AppName=PasslinkAdaptor
AppId=BayerPasslinkAdaptor
AppVersion={#WSTSVersion}
AppPublisher=Bayer HealthCare LLC
AppPublisherURL=http://www.services.ri.bayer.com/
MinVersion=5.1.2600
DefaultDirName={code:GetDirName|directory}
DefaultGroupName=Bayer HealthCare Services
DisableDirPage=yes
DisableProgramGroupPage=yes
DisableFinishedPage=yes
UsePreviousAppDir=no
AllowNoIcons=yes
WizardImageFile=Logo_Cross_Screen_RGB.bmp
WizardSmallImageFile=Logo_Cross_Screen_RGB_icon.bmp
WizardImageBackColor=clWhite
WizardImageStretch=no
VersionInfoVersion={#WSTSVersion}
VersionInfoCompany=Bayer HealthCare LLC
VersionInfoDescription=Passlink Adaptor Software.
VersionInfoCopyright= {#CopyrightYear}
OutputBaseFilename={#WSTSDNVersion}-Setup-{#WSTSVersion}
OutputDir=Output

[InstallDelete]
Type: filesandordirs; Name: "{app}\passlink-adaptor-logs"

[Files]
;; Binaries
Source: "..\build\passlink.adaptor.js"; DestDir: "{app}"; Flags: ignoreversion overwritereadonly
Source: "..\build\passlink.adaptor.js.LICENSE.txt"; DestDir: "{app}"; Flags: ignoreversion overwritereadonly
Source: "..\Externals\iproxy.exe"; DestDir: "{app}\Externals"; Flags: ignoreversion overwritereadonly
Source: "..\Externals\libimobiledevice-glue-1.0.dll"; DestDir: "{app}\Externals"; Flags: ignoreversion overwritereadonly
Source: "..\Externals\libplist-2.0.dll"; DestDir: "{app}\Externals"; Flags: ignoreversion overwritereadonly                        
Source: "..\Externals\libusbmuxd-2.0.dll"; DestDir: "{app}\Externals"; Flags: ignoreversion overwritereadonly
Source: "..\node.exe"; DestDir: "{app}"; Flags: ignoreversion overwritereadonly;
Source: "..\nssm.exe"; DestDir: "{app}"; Flags: ignoreversion overwritereadonly
Source: "..\removePasslinkAdaptor.bat"; DestDir: "{app}"; Flags: ignoreversion overwritereadonly
Source: "..\installPasslinkAdaptor.bat"; DestDir: "{app}"; Flags: ignoreversion overwritereadonly
;; Temp Installers
Source: "12-11-AppleMobileDeviceSupport64.msi"; DestDir: "{tmp}"; DestName: "12-11-AppleMobileDeviceSupport64.msi"; Flags: deleteafterinstall;
Source: "12-12-AppleMobileDeviceSupport64.msi"; DestDir: "{tmp}"; DestName: "12-12-AppleMobileDeviceSupport64.msi"; Flags: deleteafterinstall;

[Run]
Filename: "{app}\installPasslinkAdaptor.bat"; Parameters: "{app}"; Flags: waituntilterminated runhidden
Filename: "msiexec.exe"; Parameters: "/i ""{tmp}\12-11-AppleMobileDeviceSupport64.msi"" /qb /norestart";  WorkingDir: {tmp}; StatusMsg: "Installing Apple Mobile Device Support ...this may take several minutes.";
Filename: "msiexec.exe"; Parameters: "/i ""{tmp}\12-12-AppleMobileDeviceSupport64.msi"" /qb /norestart"; WorkingDir: {tmp}; StatusMsg: "Installing Apple Mobile Device Support upgrade ...this may take several minutes.";

[Icons]

[Tasks]

[Code]
var
    driveName : String;
    dirName: String;
    exeName: String;

procedure InitializeWizard();
begin
    WizardForm.NoRadio.Checked := True;
    WizardForm.FinishedLabel.Caption := 'Installation Finish. Click OK.';
end;

function GetDrive(dirName: String): string;
var
    version: String;
begin
    if (driveName = 'unset') then
      if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\MEDRAD\Certegra', 'Version', version) then    
        if (StrToFloat(copy(version, 1, 3)) < 4.9) then     
           driveName := 'D:\'
        else                         
           driveName := 'C:\'
        else begin
            driveName := 'C:\'
            MsgBox('Injector version could not be found. Setup will default to C drive.', mbInformation, MB_OK);
        end;
    Result := driveName + dirName;
end;

function GetDirName(varReq: string): string;
begin
    if (dirName = 'unset') then
       dirName := driveName+'PassLinkAdaptor'
       Result := dirName;
end;

type
	SERVICE_STATUS = record
    	dwServiceType				: cardinal;
    	dwCurrentState				: cardinal;
    	dwControlsAccepted			: cardinal;
    	dwWin32ExitCode				: cardinal;
    	dwServiceSpecificExitCode	: cardinal;
    	dwCheckPoint				: cardinal;
    	dwWaitHint					: cardinal;
	end;
	HANDLE = cardinal;

const
	SERVICE_QUERY_CONFIG		= $1;
	SERVICE_CHANGE_CONFIG		= $2;
	SERVICE_QUERY_STATUS		= $4;
	SERVICE_START				= $10;
	SERVICE_STOP				= $20;
	SERVICE_ALL_ACCESS			= $f01ff;
	SC_MANAGER_ALL_ACCESS		= $f003f;
	SERVICE_WIN32_OWN_PROCESS	= $10;
	SERVICE_WIN32_SHARE_PROCESS	= $20;
	SERVICE_WIN32				= $30;
	SERVICE_INTERACTIVE_PROCESS = $100;
	SERVICE_BOOT_START          = $0;
	SERVICE_SYSTEM_START        = $1;
	SERVICE_AUTO_START          = $2;
	SERVICE_DEMAND_START        = $3;
	SERVICE_DISABLED            = $4;
	SERVICE_DELETE              = $10000;
	SERVICE_CONTROL_STOP		= $1;
	SERVICE_CONTROL_PAUSE		= $2;
	SERVICE_CONTROL_CONTINUE	= $3;
	SERVICE_CONTROL_INTERROGATE = $4;
	SERVICE_STOPPED				= $1;
	SERVICE_START_PENDING       = $2;
	SERVICE_STOP_PENDING        = $3;
	SERVICE_RUNNING             = $4;
	SERVICE_CONTINUE_PENDING    = $5;
	SERVICE_PAUSE_PENDING       = $6;
	SERVICE_PAUSED              = $7;

function OpenSCManager(lpMachineName, lpDatabaseName: string; dwDesiredAccess :cardinal): HANDLE;
external 'OpenSCManagerA@advapi32.dll stdcall';

function OpenService(hSCManager :HANDLE;lpServiceName: string; dwDesiredAccess :cardinal): HANDLE;
external 'OpenServiceA@advapi32.dll stdcall';

function CloseServiceHandle(hSCObject :HANDLE): boolean;
external 'CloseServiceHandle@advapi32.dll stdcall';

function CreateService(hSCManager :HANDLE;lpServiceName, lpDisplayName: string;dwDesiredAccess,dwServiceType,dwStartType,dwErrorControl: cardinal;lpBinaryPathName,lpLoadOrderGroup: String; lpdwTagId : cardinal;lpDependencies,lpServiceStartName,lpPassword :string): cardinal;
external 'CreateServiceA@advapi32.dll stdcall';

function DeleteService(hService :HANDLE): boolean;
external 'DeleteService@advapi32.dll stdcall';

function StartNTService(hService :HANDLE;dwNumServiceArgs : cardinal;lpServiceArgVectors : cardinal) : boolean;
external 'StartServiceA@advapi32.dll stdcall';

function ControlService(hService :HANDLE; dwControl :cardinal;var ServiceStatus :SERVICE_STATUS) : boolean;
external 'ControlService@advapi32.dll stdcall';

function QueryServiceStatus(hService :HANDLE;var ServiceStatus :SERVICE_STATUS) : boolean;
external 'QueryServiceStatus@advapi32.dll stdcall';

function QueryServiceStatusEx(hService :HANDLE;ServiceStatus :SERVICE_STATUS) : boolean;
external 'QueryServiceStatus@advapi32.dll stdcall';
function OpenServiceManager() : HANDLE;

begin
	if UsingWinNT() = true then begin
		Result := OpenSCManager('','ServicesActive',SC_MANAGER_ALL_ACCESS);
		if Result = 0 then
			MsgBox('the servicemanager is not available', mbError, MB_OK)
	end
	else begin
			MsgBox('only nt based systems support services', mbError, MB_OK)
			Result := 0;
	end
end;

	
function RemoveService(ServiceName: string) : boolean;
var
	hSCM	: HANDLE;
	hService: HANDLE;
begin
	hSCM := OpenServiceManager();
	Result := false;
	if hSCM <> 0 then begin
		hService := OpenService(hSCM,ServiceName,SERVICE_DELETE);
        if hService <> 0 then begin
            Result := DeleteService(hService);
            CloseServiceHandle(hService)
		end;
        CloseServiceHandle(hSCM)
	end
end;
function StopService(ServiceName: string) : boolean;
var
	hSCM	: HANDLE;
	hService: HANDLE;
	Status	: SERVICE_STATUS;
begin
	hSCM := OpenServiceManager();
	Result := false;
	if hSCM <> 0 then begin
		hService := OpenService(hSCM,ServiceName,SERVICE_STOP);
        if hService <> 0 then begin
        	Result := ControlService(hService,SERVICE_CONTROL_STOP,Status);
            CloseServiceHandle(hService)
		end;
        CloseServiceHandle(hSCM)
	end;
end;

function IsServiceRunning(ServiceName: string) : boolean;
var
	hSCM	: HANDLE;
	hService: HANDLE;
	Status	: SERVICE_STATUS;
begin
	hSCM := OpenServiceManager();
	Result := false;
	if hSCM <> 0 then begin
		hService := OpenService(hSCM,ServiceName,SERVICE_QUERY_STATUS);
    	if hService <> 0 then begin
			if QueryServiceStatus(hService,Status) then begin
				Result :=(Status.dwCurrentState = SERVICE_RUNNING)
        	end;
            CloseServiceHandle(hService)
		    end;
        CloseServiceHandle(hSCM)
	end
end;



function InitializeSetup(): Boolean;
var
    errorCode: Integer;
begin

  if IsServiceRunning('PasslinkAdaptor.Service') then begin
    StopService('PasslinkAdaptor.Service');
    RemoveService('PasslinkAdaptor');
  end

  driveName := 'unset';
  dirName := 'unset';
  exeName := 'unset';
  GetDrive('');
  if (GetDirName('') = 'unset') then begin
    SuppressibleMsgBox('Could not find workstation root directory.'#13#10'        Cancelling install', mbError, MB_OK, IDOK)
    Result := False
  end else begin
    ShellExec('open','taskkill.exe','/f /im '+exeName,'',SW_HIDE,ewNoWait,errorCode);
    Result:= true;
  end;
end;