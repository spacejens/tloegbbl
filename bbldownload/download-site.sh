#! /bin/bash

if [ $# -eq 0 ]; then
    echo "Error: Must provide hostname of BBL site as argument (e.g. https://tloeg.bbleague.se/)"
    exit 1
fi

SITE=$1

# TODO Split long command into several lines to make diff easier
# TODO Save log to file using --output-file and/or piping to tee
# TODO Ensure that redirects are followed to required depth, see https://stackoverflow.com/questions/20030148/wget-doesnt-download-recursively-after-following-a-redirect and https://unix.stackexchange.com/questions/409804/wget-not-working-for-downloading-all-links-from-a-webpage
# TODO Unusual characters in URLs, e.g. Rösereds Idrottspack linked as default.asp?p=tm&t=rös ends up as https://tloeg.bbleague.se/default.asp?p=tm&t=r%F6s
# TODO Converting links to enable navigation, see https://danielmalmer.medium.com/heres-why-wget-s-convert-links-option-isn-t-converting-your-links-cec832ee934c
# TODO Verify that all files have been downloaded
wget --config=wget.ini --recursive --level=inf --page-requisites --convert-links --wait=3 --directory-prefix=bbl-site/ $SITE
