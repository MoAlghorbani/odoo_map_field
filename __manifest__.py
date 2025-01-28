# -*- coding: utf-8 -*-
{
    'name' : 'Map Field',
    'version' : '17.0.0.1',
    'summary': 'Map Field',
    'sequence': 10,
    'description': """
Map Field
====================
    """,
    'depends': ['base','web'],    
    'installable': True,
    'application': True,
    "data": [
        "views/map_setting_view.xml",
        "security/ir.model.access.csv"
    ],
    'assets': {
        'web.assets_backend': [
            'map_field/static/src/**/*',
        ],
    },
    'license': 'LGPL-3',
}
