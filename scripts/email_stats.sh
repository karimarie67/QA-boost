#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 YYYY/MM"
  exit 1
fi

input_month="$1"

# Extract year and month
year=$(echo "$input_month" | cut -d'/' -f1)
month=$(echo "$input_month" | cut -d'/' -f2)

# Validate input
if [[ ! "$year" =~ ^[0-9]{4}$ ]] || [[ ! "$month" =~ ^[0-9]{2}$ ]]; then
  echo "Invalid date format. Use YYYY/MM (e.g. 2025/04)"
  exit 1
fi

# Create start date
start_date="${year}-${month}-01"

# Calculate end date (first day of next month)
if [ "$month" = "12" ]; then
  end_year=$((year + 1))
  end_month="01"
else
  end_year=$year
  end_month=$(printf "%02d" $((10#$month + 1)))
fi

end_date="${end_year}-${end_month}-01"

echo "Querying stats for: ${start_date} to ${end_date}"
echo ""

echo "Number of posts:"
psql -h localhost -U postgres -d lists_production_web -c "
SELECT COUNT(*) 
FROM hyperkitty_email 
WHERE date >= '${start_date}' AND date < '${end_date}';"

echo ""
echo "Number of unique authors:"
psql -h localhost -U postgres -d lists_production_web -c "
SELECT COUNT(DISTINCT(sender_id)) 
FROM hyperkitty_email
WHERE date >= '${start_date}' AND date < '${end_date}';"
