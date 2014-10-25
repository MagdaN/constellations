#!/usr/bin/env python

import json,sys,math
from astropy import units as u
from astroquery.simbad import Simbad
from astropy.coordinates import SkyCoord
from astropy.utils.misc import JsonCustomEncoder

Simbad.add_votable_fields('parallax')

stars = ['Sirius','Deneb','Polaris']

orion = [
    {
        "designation": "alpha",
        "name": "Beteigeuze"
    },
    {
        "designation": "beta",
        "name": "Rigel"
    },
    {
        "designation": "gamma",
        "name": "Bellatrix"
    },
    {
        "designation": "epsilon",
        "name": "Alnilam"
    },
    {
        "designation": "zeta",
        "name": "Alnitak"
    },
    {
        "designation": "kappa",
        "name": "Saiph"
    },
    {
        "designation": "delta",
        "name": "Mintaka"
    }
]

def get_coord(star):
    print star
    result = Simbad.query_object(star)[0]

    coord_string = result['RA'] + ' ' + result['DEC']

    parallax = (float(result['PLX_VALUE']) * u.mas).to(u.arcsec) / u.arcsec
    distance = 1.0 / parallax * u.pc

    return SkyCoord(coord_string, 'icrs', unit=(u.hourangle, u.deg), distance=distance)

destinations = {}
for star in stars:
    destinations[star] = get_coord(star)

output = {
    'destinations': [],
    'orion': []
}

for star in destinations:
    output['destinations'].append({
        'name': star,
        'distance': destinations[star].distance
    })

for star in orion:
    designation = star['designation'] + ' orion'

    coord = get_coord(designation)

    o = {
        'designation': designation,
        'name': star['name'],
        'coords': {
            'Sol': {
                'ra': float(coord.ra.to_string(decimal=True)),
                'dec': float(coord.dec.to_string(decimal=True))
            }
        }
    }

    for star in destinations:
        destination_coords = SkyCoord(x=coord.cartesian.x - destinations[star].cartesian.x,
                                      y=coord.cartesian.y - destinations[star].cartesian.y,
                                      z=coord.cartesian.z - destinations[star].cartesian.z,
                                      unit='pc',frame='icrs',representation='cartesian')
        destination_coords.representation = 'spherical'

        o['coords'][star] = {
            'ra': float(destination_coords.ra.to_string(decimal=True)),
            'dec': float(destination_coords.dec.to_string(decimal=True))
        }

    output['orion'].append(o)

open('orion.json','w').write(json.dumps(output, cls=JsonCustomEncoder))
