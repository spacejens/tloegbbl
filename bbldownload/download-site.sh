#! /bin/bash

if [ $# -eq 0 ]; then
    echo "Error: Must provide hostname of BBL site as argument (e.g. tloeg.bbleague.se)"
    exit 1
fi

SITE=$1
mkdir -p bbl-site/$SITE

# TODO Ensure that redirects are followed to required depth, see https://stackoverflow.com/questions/20030148/wget-doesnt-download-recursively-after-following-a-redirect and https://unix.stackexchange.com/questions/409804/wget-not-working-for-downloading-all-links-from-a-webpage
# TODO Unusual characters in URLs, e.g. Rösereds Idrottspack linked as default.asp?p=tm&t=rös ends up as https://tloeg.bbleague.se/default.asp?p=tm&t=r%F6s
# TODO Perhaps --local-encoding=UTF-8 and/or --remote-encoding=UTF-8 helps, see https://superuser.com/questions/1621693/how-to-archive-urls-with-special-chars-with-wget-on-windows
# TODO Converting links to enable navigation, see https://danielmalmer.medium.com/heres-why-wget-s-convert-links-option-isn-t-converting-your-links-cec832ee934c
# TODO Don't think it's needed, but may want to try --content-disposition, see https://www.reddit.com/r/linuxquestions/comments/zws6ei/wget_issues_with_special_characters_in_deb_url/
# TODO Wget doesn't follow onclick script setting href, will need to grep for those and loop until no new such links are found. Try: grep "href='?.*'" *
# TODO Verify that all files have been downloaded
wget \
    --config=wget.ini \
    --no-clobber \
    --recursive \
    --level=inf \
    --page-requisites \
    --convert-links \
    --wait=3 \
    --directory-prefix=bbl-site/ \
    --output-file=bbl-site/$SITE/output-wget.log \
    $SITE

# TODO Copy (cp -a) output directory to a time-stamped version of it
# TODO Create time-stamped ZIP archive of output folder (zip -r stuff.zip folder)
