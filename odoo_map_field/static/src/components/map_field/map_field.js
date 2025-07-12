/** @odoo-module **/

import { Component, onMounted, useEffect ,onWillStart, useRef, useState } from "@odoo/owl";
import { loadCSS, loadJS } from "@web/core/assets";
import { AlertDialog, ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { useService } from "@web/core/utils/hooks";

export class MapField extends Component {
    setup() {
        this.root = useRef('map')
        this.dialogService = useService("dialog");
        this.orm = useService("orm");
        this.marker = null;
        this.state = useState({
            latitude: this.props.record.data[this.props.name].split(",")[0],
            longitude: this.props.record.data[this.props.name].split(",")[1],
            latitude_conf: "31.777972043071177",
            longitude_conf: "35.23535266127317",
            country_code_conf: null
        })
        onWillStart(async () => {
            await loadJS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
            await loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")
            await loadJS("/odoo_map_field/static/lib/leaflet-geocoder.js")
            await loadCSS("/odoo_map_field/static/lib/leaflet-geocoder.css")
            const x = await this.orm.searchRead("res.config.settings", [], ['latitude_conf', 'longitude_conf', 'country_code_conf'])
            if (x.at(-1) && 'latitude_conf' in x.at(-1)) {
                this.state.latitude_conf = x.at(-1).latitude_conf || "31.77805412782377"
            }
            if (x.at(-1) && 'longitude_conf' in x.at(-1)) {
                this.state.longitude_conf = x.at(-1).longitude_conf || "31.77805412782377"
            }
            if (x.at(-1) && 'country_code_conf' in x.at(-1)) {
                this.state.country_code_conf = x.at(-1).country_code_conf || ""
            }
        })
        onMounted(() => {
            if (this.state.showMap){
                this.initializeMap();
            }
        });
        useEffect(
            ()=>{
                if (this.state.showMap){
                    this.initializeMap();
                }
            },
            ()=>[this.state.showMap]
        )
    }
    initializeMap(){
        this.map = L.map(this.root.el).setView([
            this.props.record.data[this.props.name] ?
                this.props.record.data[this.props.name].split(",")[0] :
                this.state.latitude_conf,
            this.props.record.data[this.props.name] ?
                this.props.record.data[this.props.name].split(",")[1] :
                this.state.longitude_conf
        ], 13);
        L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
        }).addTo(this.map);
        var options = {
            position: 'topright',
            geocoder: new L.Control.Geocoder.nominatim({
                geocodingQueryParams: {
                    "countrycodes": this.state.country_code_conf || "",
                    limit: 10
                }
            })
        };
        
        L.Control.geocoder(options).addTo(this.map);

        if (this.props.record.data[this.props.name] && this.props.record.data[this.props.name].split(",")[0] && this.props.record.data[this.props.name].split(",")[1]) {
            this.marker = L.marker([this.props.record.data[this.props.name].split(",")[0], this.props.record.data[this.props.name].split(",")[1]]).addTo(this.map);
            this.marker._icon.classList.add("marker_color")
        }
        this.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            if (this.marker) {
                this.marker.remove();
            }

            this.marker = L.marker([lat, lng]).addTo(this.map);
            this.marker._icon.classList.add("marker_color")
            this.state.longitude = lng;
            this.state.latitude = lat;
            this.updateData();
        })
    }
    async updateData(){
        await this.props.record.update({ [this.props.name]: `${this.state.latitude},${this.state.longitude}`});
    }
    async getCurrentLocation() {
        if ("geolocation" in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;

                if (this.marker) {
                    this.marker.remove();
                }

                this.map.setView([latitude, longitude], 13);
                this.marker = L.marker([latitude, longitude]).addTo(this.map);
                this.marker._icon.classList.add("marker_color");
                this.state.longitude = longitude;
                this.state.latitude = latitude;
                this.updateData();
            } catch (error) {
                this.dialogService.add(AlertDialog, {
                    title: "Something went wrong",
                    body: error.code == 1 ? "Please enable location service" : "Something went wrong",
                });
            }
        }
    }
    openMap() {
        this.state.showMap = true;
    }

    closeMap() {
        this.state.showMap = false;
    }

    async deleteLocation() {
        if (this.marker) {
            this.marker.remove();
        }
        this.state.longitude = null;
        this.state.latitude = null;
        await this.props.record.update({ [this.props.name]: null });
    }
    deleteDialog() {
        this.dialogService.add(ConfirmationDialog, {
            title: "Warning",
            body: "Do you want to delete the location?",
            confirm: () => {
                this.deleteLocation();
            },
            cancel: () => { },
        })
    } 
}

MapField.props = {
    ...standardFieldProps,
    latitude: { type: Number, optional: true },
    longitude: { type: Number, optional: true },
};
MapField.template = "odoo_map_field.MapField";

export const mapField = {
    component: MapField,
    supportedTypes: ["char"],
    isEmpty: () => false,
};

registry.category("fields").add("map", mapField);

