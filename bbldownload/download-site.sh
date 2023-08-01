#! /bin/bash

if [ $# -eq 0 ]; then
    echo "Error: Must provide hostname of BBL site as argument (e.g. tloeg.bbleague.se)"
    exit 1
fi

SITE=$1
mkdir -p bbl-site/$SITE
TIMESTAMP=`date '+%Y%m%d%H%M%S'`

echo $SITE > bbl-site/$SITE/wget-input-$TIMESTAMP-1.txt
# TODO Also add other entry points (e.g. default.asp) to the initial input file

touch bbl-site/$SITE/wget-href-$TIMESTAMP-0.txt

ITERATION=1
PREVIOUS=0
while true
do
    # TODO Should this only find JavaScript hrefs, or A-hrefs as well? Finding all makes it work for resuming previous run (e.g. to reload deleted files), but adds more hrefs (that wget will ignore due to --no-clobber)
    grep --directories=skip --no-filename --only-matching "href=['\"][^'\"]*['\"]" bbl-site/$SITE/* \
        | sed 's/^href=//g' \
        | sed 's/"//g' \
        | sed "s/'//g" \
        | sed 's/#.*$//g' \
        | grep -v "^http" \
        | grep -v "=$" \
        | sed 's/^\?/default.asp\?/g' \
        | sed "s/^/$SITE\//g" \
        | sort -u \
        > bbl-site/$SITE/wget-href-$TIMESTAMP-$ITERATION.txt

    comm -13 bbl-site/$SITE/wget-href-$TIMESTAMP-$PREVIOUS.txt bbl-site/$SITE/wget-href-$TIMESTAMP-$ITERATION.txt \
        >> bbl-site/$SITE/wget-input-$TIMESTAMP-$ITERATION.txt

    if [ ! -s bbl-site/$SITE/wget-input-$TIMESTAMP-$ITERATION.txt ]; then
        break
    fi

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

    PREVIOUS=$ITERATION
    ITERATION=$((ITERATION + 1))
done

cp -a bbl-site/$SITE bbl-site/$SITE-$TIMESTAMP
zip -r bbl-site/$SITE-$TIMESTAMP.zip bbl-site/$SITE-$TIMESTAMP

# TODO Print resulting status (number of files in directory, grep for HTTP response codes, suggestion to run again to ensure nothing was missed)
