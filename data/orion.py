#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json,sys,math
from astropy import units as u
from astroquery.simbad import Simbad
from astropy.coordinates import SkyCoord
from astropy.utils.misc import JsonCustomEncoder

Simbad.add_votable_fields('parallax')
Simbad.add_votable_fields('sptype')
Simbad.add_votable_fields('flux(V)')

def query_simbad(star):
    print star
    result = Simbad.query_object(star)[0]

    coord_string = result['RA'] + ' ' + result['DEC']

    parallax = (float(result['PLX_VALUE']) * u.mas).to(u.arcsec) / u.arcsec
    distance = 1.0 / parallax * u.pc

    coord = SkyCoord(coord_string, 'icrs', unit=(u.hourangle, u.deg), distance=distance)
    spectype = result['SP_TYPE']
    vmag = result['FLUX_V']

    dimless_distance = coord.distance / u.pc

    amag = - 5 * math.log10(dimless_distance) + 5 + vmag

    return coord,spectype,vmag,amag

destinations_input = json.loads(open('destinations_input.json').read())
orion_input        = json.loads(open('orion_input.json').read())

destination_coords = {}
destinations = []

sol = {}
for key in destinations_input[0]:
    sol[key] = destinations_input[0][key]
destinations.append(sol)

for destination in destinations_input[1:]:
    coord,spectype,vmag,amag = query_simbad(destination['name'])

    destination_coords[destination['name']] = coord
    destinations.append({
        'name': destination['name'],
        'description': destination['description'],
        'distance': '%.1f' % float(coord.distance.to('lyr') / u.lyr),
        'spectype': spectype,
        'vmag': '%.1f' % float(vmag),
        'amag': '%.1f' % float(amag)
    })

output = {
    'destinations': destinations,
    'orion': [],
    'path': orion_input['path']
}

for star in orion_input['stars']:
    designation = star['designation'] + ' orion'

    coord = query_simbad(designation)[0]

    star = {
        'designation': designation,
        'name': star['name'],
        'coords': {
            'Sol': {
                'ra': float(coord.ra.to_string(decimal=True)),
                'dec': float(coord.dec.to_string(decimal=True))
            }
        }
    }

    for name in destination_coords:
        shifted_coords = SkyCoord(x=coord.cartesian.x - destination_coords[name].cartesian.x,
                                  y=coord.cartesian.y - destination_coords[name].cartesian.y,
                                  z=coord.cartesian.z - destination_coords[name].cartesian.z,
                                  unit='pc',frame='icrs',representation='cartesian')
        shifted_coords.representation = 'spherical'

        star['coords'][name] = {
            'ra': float(shifted_coords.ra.to_string(decimal=True)),
            'dec': float(shifted_coords.dec.to_string(decimal=True))
        }

    output['orion'].append(star)

open('orion.json','w').write(json.dumps(output, cls=JsonCustomEncoder))
