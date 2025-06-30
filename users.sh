
#!/bin/bash

# Get current time and date
current_time=$(date +"%Y-%m-%d %H:%M:%S")

# Get logged-in users
logged_in_users=$(who | cut -d' ' -f1)

# Calculate system uptime
uptime=$(uptime -p | sed 's/ up //')

# Get system information
system_info="System: $(uname -s)
Release: $(uname -r)
Version: $(uname -v)
Machine: $(uname -m)
Processor: $(uname -p)"

# Log system information to file
echo "Time: $current_time" >> system_log.log
echo "Logged-in Users: $logged_in_users" >> system_log.log
echo "System Uptime: $uptime" >> system_log.log
echo "$system_info" >> system_log.log
echo "" >> system_log.log

# Print system information to console
echo "Current Time: $current_time"
echo "Logged-in Users: $logged_in_users"
echo "System Uptime: $uptime"
echo "System Information:"
echo "$system_info"
