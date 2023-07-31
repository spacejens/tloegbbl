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

    # TODO Ensure that redirects are followed to required depth, see https://stackoverflow.com/questions/20030148/wget-doesnt-download-recursively-after-following-a-redirect and https://unix.stackexchange.com/questions/409804/wget-not-working-for-downloading-all-links-from-a-webpage
    # TODO Don't think it's needed, but may want to try --content-disposition, see https://www.reddit.com/r/linuxquestions/comments/zws6ei/wget_issues_with_special_characters_in_deb_url/
    # TODO Wget doesn't follow onclick script setting href, will need to grep for those and loop until no new such links are found. Try: grep "href='?.*'" *
    # TODO Verify that all files have been downloaded
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
