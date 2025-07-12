# -*- coding: utf-8 -*-
import logging

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class Map_setup(models.Model):
    _name = 'map_setup'
    _description = 'Map_setup'
     
    latitude = fields.Char(string="Latitude",)
    longitude = fields.Char(string="Longitude",)
    country_code = fields.Char(string="Country Code")