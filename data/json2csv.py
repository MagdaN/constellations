#!/usr/bin/env python

import json,sys

inputfile = open(sys.argv[1])
outputfile = open(sys.argv[2],'w')

stars = json.loads(inputfile.read())
inputfile.close()

for star in stars:

    outputfile.write('%s\t%s\t%s\t%s\n' % (star['sol']['ra'],star['sol']['dec'],star['sirius']['ra'],star['sirius']['dec']))
outputfile.close()
