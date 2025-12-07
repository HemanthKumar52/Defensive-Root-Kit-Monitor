import ctypes
from ctypes import *
from ctypes.wintypes import *

# Type definitions might be missing in wintypes depending on version
if not hasattr(ctypes.wintypes, 'ULONGLONG'):
    ULONGLONG = ctypes.c_ulonglong
if not hasattr(ctypes.wintypes, 'SIZE_T'):
    SIZE_T = ctypes.c_size_t
if not hasattr(ctypes.wintypes, 'ULONG_PTR'):
    if ctypes.sizeof(ctypes.c_void_p) == 8:
        ULONG_PTR = ctypes.c_ulonglong
    else:
        ULONG_PTR = ctypes.c_ulong

# Constants
SystemProcessInformation = 5
STATUS_INFO_LENGTH_MISMATCH = 0xC0000004
STATUS_SUCCESS = 0x00000000

# Structures
class UNICODE_STRING(Structure):
    _fields_ = [
        ("Length", USHORT),
        ("MaximumLength", USHORT),
        ("Buffer", LPWSTR)
    ]

class SYSTEM_PROCESS_INFORMATION(Structure):
    _fields_ = [
        ("NextEntryOffset", ULONG),
        ("NumberOfThreads", ULONG),
        ("WorkingSetPrivateSize", LARGE_INTEGER), # Reserved1
        ("HardFaultCount", ULONG), # Reserved2
        ("NumberOfThreadsHighWatermark", ULONG), # Reserved3
        ("CycleTime", ULONGLONG), # Reserved4
        ("CreateTime", LARGE_INTEGER),
        ("UserTime", LARGE_INTEGER),
        ("KernelTime", LARGE_INTEGER),
        ("ImageName", UNICODE_STRING),
        ("BasePriority", LONG),
        ("UniqueProcessId", HANDLE),
        ("InheritedFromUniqueProcessId", HANDLE),
        ("HandleCount", ULONG),
        ("SessionId", ULONG),
        ("UniqueProcessKey", ULONG_PTR), # Reserved5
        ("PeakVirtualSize", SIZE_T),
        ("VirtualSize", SIZE_T),
        ("PageFaultCount", ULONG),
        ("PeakWorkingSetSize", SIZE_T),
        ("WorkingSetSize", SIZE_T),
        ("QuotaPeakPagedPoolUsage", SIZE_T),
        ("QuotaPagedPoolUsage", SIZE_T),
        ("QuotaPeakNonPagedPoolUsage", SIZE_T),
        ("QuotaNonPagedPoolUsage", SIZE_T),
        ("PagefileUsage", SIZE_T),
        ("PeakPagefileUsage", SIZE_T),
        ("PrivatePageCount", SIZE_T),
        ("ReadOperationCount", LARGE_INTEGER),
        ("WriteOperationCount", LARGE_INTEGER),
        ("OtherOperationCount", LARGE_INTEGER),
        ("ReadTransferCount", LARGE_INTEGER),
        ("WriteTransferCount", LARGE_INTEGER),
        ("OtherTransferCount", LARGE_INTEGER)
    ]

ntdll = ctypes.WinDLL("ntdll")

def get_processes_via_ntquery():
    """
    Enumerates processes using the native API NtQuerySystemInformation.
    This is often used to bypass standard API hooks (user-mode).
    """
    buffer_size = 1024 * 1024  # Start with 1MB
    buffer = create_string_buffer(buffer_size)
    
    return_length = ULONG(0)
    
    while True:
        status = ntdll.NtQuerySystemInformation(
            SystemProcessInformation,
            buffer,
            buffer_size,
            byref(return_length)
        )
        
        if status == STATUS_SUCCESS:
            break
        elif status == STATUS_INFO_LENGTH_MISMATCH:
            buffer_size = return_length.value
            buffer = create_string_buffer(buffer_size)
        else:
            # Failed
            return []

    # Parse the buffer
    processes = []
    offset = 0
    while True:
        p = cast(addressof(buffer) + offset, POINTER(SYSTEM_PROCESS_INFORMATION)).contents
        
        pid = p.UniqueProcessId
        try:
            name = p.ImageName.Buffer
        except:
            name = ""
            
        processes.append({
            "pid": pid,
            "name": name,
            "ppid": p.InheritedFromUniqueProcessId,
            "thread_count": p.NumberOfThreads,
            "handle_count": p.HandleCount
        })
        
        if p.NextEntryOffset == 0:
            break
        offset += p.NextEntryOffset
        
    return processes
