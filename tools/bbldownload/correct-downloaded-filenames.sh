#! /bin/bash

# Hostname must be specified
if [ $# -eq 0 ]; then
    echo "Error: Must provide hostname of BBL site as argument (e.g. tloeg.bbleague.se)"
    exit 1
fi

# Get files that were somehow missed by the download script (probably due to åäö at beginning of query parameter)
wget --config=wget.ini --no-clobber --page-requisites --wait=1 --remote-encoding=UTF-8 --directory-prefix=bbl-site/ "http://tloeg.bbleague.se/default.asp?p=ma&so=t&t=%E4ng"
wget --config=wget.ini --no-clobber --page-requisites --wait=1 --remote-encoding=UTF-8 --directory-prefix=bbl-site/ "http://tloeg.bbleague.se/default.asp?p=plo&t=%E4ng"
wget --config=wget.ini --no-clobber --page-requisites --wait=1 --remote-encoding=UTF-8 --directory-prefix=bbl-site/ "http://tloeg.bbleague.se/default.asp?p=plo&t=%E4ng&sort=spp"
wget --config=wget.ini --no-clobber --page-requisites --wait=1 --remote-encoding=UTF-8 --directory-prefix=bbl-site/ "http://tloeg.bbleague.se/default.asp?p=plo&t=%E4ng&sort=typ"
wget --config=wget.ini --no-clobber --page-requisites --wait=1 --remote-encoding=UTF-8 --directory-prefix=bbl-site/ "http://tloeg.bbleague.se/default.asp?p=ro&t=%E4ng"
wget --config=wget.ini --no-clobber --page-requisites --wait=1 --remote-encoding=UTF-8 --directory-prefix=bbl-site/ "http://tloeg.bbleague.se/default.asp?p=tm&t=%E4ng"

SITE=$1
cd bbl-site/$SITE

# blå = Blåvingarna
mv 'default.asp?p=ma&so=t&t=bl'$'\345' 'default.asp?p=ma&so=t&t=blå'
mv 'default.asp?p=plo&t=bl'$'\345' 'default.asp?p=plo&t=blå'
mv 'default.asp?p=plo&t=bl'$'\345''&sort=spp' 'default.asp?p=plo&t=blå&sort=spp'
mv 'default.asp?p=plo&t=bl'$'\345''&sort=typ' 'default.asp?p=plo&t=blå&sort=typ'
mv 'default.asp?p=ro&t=bl'$'\345' 'default.asp?p=ro&t=blå'
mv 'default.asp?p=tm&t=bl'$'\345' 'default.asp?p=tm&t=blå'

# brä = Bräkenäs Betongbockar
mv 'default.asp?p=ma&so=t&t=br'$'\344' 'default.asp?p=ma&so=t&t=brä'
mv 'default.asp?p=plo&t=br'$'\344' 'default.asp?p=plo&t=brä'
mv 'default.asp?p=plo&t=br'$'\344''&sort=spp' 'default.asp?p=plo&t=brä&sort=spp'
mv 'default.asp?p=plo&t=br'$'\344''&sort=typ' 'default.asp?p=plo&t=brä&sort=typ'
mv 'default.asp?p=ro&t=br'$'\344' 'default.asp?p=ro&t=brä'
mv 'default.asp?p=tm&t=br'$'\344' 'default.asp?p=tm&t=brä'

# gås = Gåshöjdens BK
mv 'default.asp?p=ma&so=t&t=g'$'\345''s' 'default.asp?p=ma&so=t&t=gås'
mv 'default.asp?p=plo&t=g'$'\345''s' 'default.asp?p=plo&t=gås'
mv 'default.asp?p=plo&t=g'$'\345''s&sort=spp' 'default.asp?p=plo&t=gås&sort=spp'
mv 'default.asp?p=plo&t=g'$'\345''s&sort=typ' 'default.asp?p=plo&t=gås&sort=typ'
mv 'default.asp?p=ro&t=g'$'\345''s' 'default.asp?p=ro&t=gås'
mv 'default.asp?p=tm&t=g'$'\345''s' 'default.asp?p=tm&t=gås'

# göt = Göteborgs Geléhallon
mv 'default.asp?p=ma&so=t&t=g'$'\366''t' 'default.asp?p=ma&so=t&t=göt'
mv 'default.asp?p=plo&t=g'$'\366''t' 'default.asp?p=plo&t=göt'
mv 'default.asp?p=plo&t=g'$'\366''t&sort=spp' 'default.asp?p=plo&t=göt&sort=spp'
mv 'default.asp?p=plo&t=g'$'\366''t&sort=typ' 'default.asp?p=plo&t=göt&sort=typ'
mv 'default.asp?p=ro&t=g'$'\366''t' 'default.asp?p=ro&t=göt'
mv 'default.asp?p=tm&t=g'$'\366''t' 'default.asp?p=tm&t=göt'

# häl = HällingSjö IFK
mv 'default.asp?p=ma&so=t&t=h'$'\344''l' 'default.asp?p=ma&so=t&t=häl'
mv 'default.asp?p=plo&t=h'$'\344''l' 'default.asp?p=plo&t=häl'
mv 'default.asp?p=plo&t=h'$'\344''l&sort=spp' 'default.asp?p=plo&t=häl&sort=spp'
mv 'default.asp?p=plo&t=h'$'\344''l&sort=typ' 'default.asp?p=plo&t=häl&sort=typ'
mv 'default.asp?p=ro&t=h'$'\344''l' 'default.asp?p=ro&t=häl'
mv 'default.asp?p=tm&t=h'$'\344''l' 'default.asp?p=tm&t=häl'

# kär = Kärringbergets Go'gra Gubbar
mv 'default.asp?p=ma&so=t&t=k'$'\344''r' 'default.asp?p=ma&so=t&t=kär'
mv 'default.asp?p=plo&t=k'$'\344''r' 'default.asp?p=plo&t=kär'
mv 'default.asp?p=plo&t=k'$'\344''r&sort=spp' 'default.asp?p=plo&t=kär&sort=spp'
mv 'default.asp?p=plo&t=k'$'\344''r&sort=typ' 'default.asp?p=plo&t=kär&sort=typ'
mv 'default.asp?p=ro&t=k'$'\344''r' 'default.asp?p=ro&t=kär'
mv 'default.asp?p=tm&t=k'$'\344''r' 'default.asp?p=tm&t=kär'

# läd = Läderlapparna
mv 'default.asp?p=ma&so=t&t=l'$'\344''d' 'default.asp?p=ma&so=t&t=läd'
mv 'default.asp?p=plo&t=l'$'\344''d' 'default.asp?p=plo&t=läd'
mv 'default.asp?p=plo&t=l'$'\344''d&sort=spp' 'default.asp?p=plo&t=läd&sort=spp'
mv 'default.asp?p=plo&t=l'$'\344''d&sort=typ' 'default.asp?p=plo&t=läd&sort=typ'
mv 'default.asp?p=ro&t=l'$'\344''d' 'default.asp?p=ro&t=läd'
mv 'default.asp?p=tm&t=l'$'\344''d' 'default.asp?p=tm&t=läd'

# lån = Långedrags Valhänta
mv 'default.asp?p=ma&so=t&t=l'$'\345''n' 'default.asp?p=ma&so=t&t=lån'
mv 'default.asp?p=plo&t=l'$'\345''n' 'default.asp?p=plo&t=lån'
mv 'default.asp?p=plo&t=l'$'\345''n&sort=spp' 'default.asp?p=plo&t=lån&sort=spp'
mv 'default.asp?p=plo&t=l'$'\345''n&sort=typ' 'default.asp?p=plo&t=lån&sort=typ'
mv 'default.asp?p=ro&t=l'$'\345''n' 'default.asp?p=ro&t=lån'
mv 'default.asp?p=tm&t=l'$'\345''n' 'default.asp?p=tm&t=lån'

# möl = Mölndals Meanest
mv 'default.asp?p=ma&so=t&t=m'$'\366''l' 'default.asp?p=ma&so=t&t=möl'
mv 'default.asp?p=plo&t=m'$'\366''l' 'default.asp?p=plo&t=möl'
mv 'default.asp?p=plo&t=m'$'\366''l&sort=spp' 'default.asp?p=plo&t=möl&sort=spp'
mv 'default.asp?p=plo&t=m'$'\366''l&sort=typ' 'default.asp?p=plo&t=möl&sort=typ'
mv 'default.asp?p=ro&t=m'$'\366''l' 'default.asp?p=ro&t=möl'
mv 'default.asp?p=tm&t=m'$'\366''l' 'default.asp?p=tm&t=möl'

# rår = Råryggen Raiders
mv 'default.asp?p=ma&so=t&t=r'$'\345''r' 'default.asp?p=ma&so=t&t=rår'
mv 'default.asp?p=plo&t=r'$'\345''r' 'default.asp?p=plo&t=rår'
mv 'default.asp?p=plo&t=r'$'\345''r&sort=spp' 'default.asp?p=plo&t=rår&sort=spp'
mv 'default.asp?p=plo&t=r'$'\345''r&sort=typ' 'default.asp?p=plo&t=rår&sort=typ'
mv 'default.asp?p=ro&t=r'$'\345''r' 'default.asp?p=ro&t=rår'
mv 'default.asp?p=tm&t=r'$'\345''r' 'default.asp?p=tm&t=rår'

# rös = Rösereds Idrottspack
mv 'default.asp?p=ma&so=t&t=r'$'\366''s' 'default.asp?p=ma&so=t&t=rös'
mv 'default.asp?p=plo&t=r'$'\366''s' 'default.asp?p=plo&t=rös'
mv 'default.asp?p=plo&t=r'$'\366''s&sort=spp' 'default.asp?p=plo&t=rös&sort=spp'
mv 'default.asp?p=plo&t=r'$'\366''s&sort=typ' 'default.asp?p=plo&t=rös&sort=typ'
mv 'default.asp?p=ro&t=r'$'\366''s' 'default.asp?p=ro&t=rös'
mv 'default.asp?p=tm&t=r'$'\366''s' 'default.asp?p=tm&t=rös'

# vät = Vättle Woodies
mv 'default.asp?p=ma&so=t&t=v'$'\344''t' 'default.asp?p=ma&so=t&t=vät'
mv 'default.asp?p=plo&t=v'$'\344''t' 'default.asp?p=plo&t=vät'
mv 'default.asp?p=plo&t=v'$'\344''t&sort=spp' 'default.asp?p=plo&t=vät&sort=spp'
mv 'default.asp?p=plo&t=v'$'\344''t&sort=typ' 'default.asp?p=plo&t=vät&sort=typ'
mv 'default.asp?p=ro&t=v'$'\344''t' 'default.asp?p=ro&t=vät'
mv 'default.asp?p=tm&t=v'$'\344''t' 'default.asp?p=tm&t=vät'

# äng = Ängårdsbergen Avengers
mv 'default.asp?p=ma&so=t&t='$'\344''ng' 'default.asp?p=ma&so=t&t=äng'
mv 'default.asp?p=plo&t='$'\344''ng' 'default.asp?p=plo&t=äng'
mv 'default.asp?p=plo&t='$'\344''ng&sort=spp' 'default.asp?p=plo&t=äng&sort=spp'
mv 'default.asp?p=plo&t='$'\344''ng&sort=typ' 'default.asp?p=plo&t=äng&sort=typ'
mv 'default.asp?p=ro&t='$'\344''ng' 'default.asp?p=ro&t=äng'
mv 'default.asp?p=tm&t='$'\344''ng' 'default.asp?p=tm&t=äng'
