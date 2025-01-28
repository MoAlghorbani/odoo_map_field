# -*- coding: utf-8 -*-
{
    "name": "Map Field",
    "version": "17.0.0.1",
    "summary": "Map Field",
    "sequence": 10,
    "depends": ["base", "web"],
    "installable": True,
    "application": True,
    "price": 60.00,
    "data": ["views/map_setting_view.xml", "security/ir.model.access.csv"],
    "assets": {
        "web.assets_backend": [
            "map_field/static/src/**/*",
        ],
    },
    "license": "OPL-1",
}
