# server created
 - file-upload - to upload data to db
 - getall - to all data
 - clear-data - to clear the collection
 - get-revenue - to get filtered data
   - provide type, region, from & to date to filter and get revenue

# cron job for clearing the data

# error handling(try & catch)

# used pino for better logs visibility

# created mongodb collection schema for storing data

## Need to improve
 - instead calculating of revenue from code, better use aggregate to calculate
 - for time being code is used to calculate
 - instead localhost db, better use atlas