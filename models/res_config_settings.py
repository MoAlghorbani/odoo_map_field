# -*- coding: utf-8 -*-
import logging

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'
    
    latitude_conf = fields.Char(string="Latitude",config_parameter='map_field.latitude')
    longitude_conf = fields.Char(string="Longitude",config_parameter='map_field.longitude')
    country_code_conf = fields.Char(string="Country Code",config_parameter='map_field.country_code')