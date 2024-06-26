#! /bin/bash

# Hostname must be specified
if [ $# -eq 0 ]; then
    echo "Error: Must provide hostname of BBL site as argument (e.g. tloeg.bbleague.se)"
    exit 1
fi

SITE=$1
mkdir -p bbl-site/$SITE

# Identify this script execution using a timestamp, which will be used for all input/log files and the resulting backups
TIMESTAMP=`date '+%Y%m%d%H%M%S'`

# Provide starting input for first loop iteration
echo $SITE > bbl-site/$SITE/wget-input-$TIMESTAMP-1.txt

# Empty list of hrefs for non-existing first iteration, to avoid need for special first iteration logic in loop
touch bbl-site/$SITE/wget-href-$TIMESTAMP-0.txt

# Loop to download everything, exit condition in the middle of the loop because of first iteration starting point
ITERATION=1
PREVIOUS=0
while true
do
    # Find all hrefs in all downloaded files, either <a href=...> or self.location.href=... from JavaScript onclick events
    # The <a href=...> should have been downloaded by the recursive wget anyway, but including them here allows resuming failed runs
    # Ignore anchor (#) parts of hrefs, we download the whole pages anyway
    # Drop hrefs that refer to other hosts
    # Drop hrefs for URLs ending with = that a JavaScript adds an ID to (typically these are action URLs)
    # Drop hrefs that are the expensive mistakes (exmiact), redraft (rdt), or journeyman (jm) actions
    # Process the hrefs to make them all on the same format, host/file?query
    grep --directories=skip --binary-files=text --no-filename --only-matching "href=['\"][^'\"]*['\"]" bbl-site/$SITE/* \
        | sed 's/^href=//g' \
        | sed 's/"//g' \
        | sed "s/'//g" \
        | sed 's/#.*$//g' \
        | grep -v "^http" \
        | grep -v "=$" \
        | grep -v "p=exmiact&" \
        | grep -v "p=rdt&" \
        | grep -v "p=jm&" \
        | sed 's/^\?/default.asp\?/g' \
        | sed 's/^\///g' \
        | sed "s/^/$SITE\//g" \
        | sort -u \
        > bbl-site/$SITE/wget-href-$TIMESTAMP-$ITERATION.txt

    # Any found href that wasn't found in the previous iteration should be downloaded this iteration, so it goes into the input files
    comm -13 bbl-site/$SITE/wget-href-$TIMESTAMP-$PREVIOUS.txt bbl-site/$SITE/wget-href-$TIMESTAMP-$ITERATION.txt \
        >> bbl-site/$SITE/wget-input-$TIMESTAMP-$ITERATION.txt

    # Exit the loop if there are no input files to process
    if [ ! -s bbl-site/$SITE/wget-input-$TIMESTAMP-$ITERATION.txt ]; then
        break
    fi

    # Download all requested input files of this generation, and their linked files recursively (avoiding duplicate downloads)
    wget \
        --config=wget.ini \
        --no-clobber \
        --recursive \
        --level=inf \
        --page-requisites \
        --wait=1 \
        --remote-encoding=UTF-8 \
        --directory-prefix=bbl-site/ \
        --output-file=bbl-site/$SITE/wget-output-$TIMESTAMP-$ITERATION.log \
        --input-file=bbl-site/$SITE/wget-input-$TIMESTAMP-$ITERATION.txt

    # Go to next iteration of the loop
    PREVIOUS=$ITERATION
    ITERATION=$((ITERATION + 1))
done

# Backup of the output directory, both unzipped and zipped
cp -a bbl-site/$SITE bbl-site/$SITE-$TIMESTAMP
zip -r bbl-site/$SITE-$TIMESTAMP.zip bbl-site/$SITE-$TIMESTAMP

# Print some status information after the completed execution
echo
echo Download of $SITE completed!
echo
echo Number of files in output directory bbl-site/$SITE-$TIMESTAMP
find bbl-site/$SITE-$TIMESTAMP -type f | wc -l
echo
echo Failed downloads such as broken links or server problems below this line, should be investigated if any are present!
grep "HTTP request sent" bbl-site/$SITE-$TIMESTAMP/wget-output-$TIMESTAMP-*.log | grep -v "200 OK" | sort -u
echo
echo You may want to run the script again to ensure nothing was missed
echo
echo When viewing the files, you may have to use "grep --binary-files=text" to prevent files containing non-standard characters from being detected as binary
