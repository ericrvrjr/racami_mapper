import { Injectable, importProvidersFrom } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as xml2js from 'xml2js';
import * as js2xml from "js2xmlparser";
@Injectable({
    providedIn: 'root'
})
export class MapperService {

    private dbFields: Array<string> = [];
    private fields: Array<string> = [];
    private kdbMap: any;
    public mapComplete: boolean = false;

    public jsonExtracted: any; 
    public jsonExtractedDup: any; 
    public jsonTransformed: any;
    public form:any;
    public jsonUri: any | undefined;
    public xmlUri: any | undefined;
    public csvUri: any | undefined;
    constructor(private sanitizer: DomSanitizer) { }

    updateFields(obj:any,map?:any) {
        map = map || {}
        Object.keys(obj).forEach(
            (key) => {
                if (
                    this.isArrayOrObject(obj[key]) &&
                    ((this.isObject(obj[key]) && !this.isEmptyObject(obj[key])) ||
                        (Array.isArray(obj[key]) && obj[key].length !== 0 && this.isObjectArray(obj[key]))) && !obj[key].hasOwnProperty("dbfield")
                ) {
                    return this.updateFields(obj[key], map)
                } else {
                    if(obj[key] !== null && obj[key].hasOwnProperty("dbfield")){
                        map[obj[key].path] = `db${obj[key].key}`;
                    }
                }
            }
        )
        return map;
    }

    getFields(): Array<string> {
        return this.fields;
    }

    updateDbFields(list: Array<string>) {
        this.dbFields = list;
    }

    getDbFields(): Array<string> {
        return this.dbFields
    }

    setMap(key:any,val:any) {
        const dotParser = require('dot-object');
        dotParser.dot(this.jsonExtracted)[`${key}.dbfield`] = val;
        this.jsonExtracted = dotParser.object(this.jsonExtracted);
        this.jsonExtractedDup = JSON.parse(JSON.stringify(this.jsonExtracted));

        console.log(this.jsonExtractedDup);
        this.checkMap();
    }

    checkMap() {
        this.mapComplete = Object.values(this.kdbMap).every(x => !!x);
        if (this.mapComplete) {
            this.jsonTransformed = this.generateFinalData(this.jsonExtractedDup);
            this.generateUris();
        }
    }

    feedMapping(obj:any,map?:any){
        map = map || {}
        //feed mapping from db
    }

    generateFinalData(obj:any,map?:any){
        map=map || []
        Object.keys(obj).forEach(
            (key) => {
                if (
                    this.isArrayOrObject(obj[key]) &&
                    ((this.isObject(obj[key]) && !this.isEmptyObject(obj[key])) ||
                        (Array.isArray(obj[key]) && obj[key].length !== 0 && this.isObjectArray(obj[key]))) && (!obj[key]?.hasOwnProperty("dbfield"))
                ) {
                    return this.generateFinalData(obj[key], map)
                } else {
                    if(obj[key] !== null && (obj[key].hasOwnProperty("dbfield"))){
                        // if(obj[key].type === "array of string"){
                        //     obj[obj[key].dbfield] = obj[key].value.split(','); 
                        //     delete obj[key]

                        // }else{
                        //     obj[obj[key].dbfield] = obj[key].value;
                        //     delete obj[key]
                        // }

                       map.push({"field":obj[key].path,"map":obj[key].dbfield})
                    }
                }
            }
        )
        return map;
    }

    isObjectArray(a: any) {
        return a.every((c: any, i: any, a: any) => typeof c === "object");
    }

    isObject(val: any) {
        return Object.prototype.toString.call(val) === '[object Object]'
    }
    isEmptyObject(val: any) {
        return Object.keys(val).length === 0
    }

    isArrayOrObject(val: any) {
        return Object(val) === val
    }

    jsonToDot(obj: any, currentMap?: any, path?: any) {
        currentMap = currentMap || {}
        path = path || []
        Object.keys(obj).forEach(
            (key) => {
                if (
                    this.isArrayOrObject(obj[key]) &&
                    ((this.isObject(obj[key]) && !this.isEmptyObject(obj[key])) ||
                        (Array.isArray(obj[key]) && obj[key].length !== 0 && this.isObjectArray(obj[key])))
                ) {
                    var previousKey = path[path.length - 1] || ''
                    if (Array.isArray(obj[key])) {
                        const keyToValMap = obj[key].reduce((map: any, el: any) => {
                            for (let k in el) {
                                map[k] = el[k];
                            }
                            return map
                        }, {})
                        return this.jsonToDot(keyToValMap, currentMap, path.concat(key))
                    } else {
                        return this.jsonToDot(obj[key], currentMap, path.concat(key))
                    }

                } else {
                    if (Array.isArray(obj[key])) {
                        currentMap[path.concat(key).join(".")] = { key:key, type: `array of ${typeof obj[key][0]}`, dbfield: `db${key}`, path: path.concat(key).join("."), value: obj[key].join(',') }
                    } else {
                        currentMap[path.concat(key).join(".")] = { key:key, type: typeof obj[key], dbfield: `db${key}`, path: path.concat(key).join("."), value: obj[key] }
                    }
                }
            }
        )
        return currentMap;
        // normalize json data to get
        //check if value is an array of objects or an object
        // if object()
        // if array of objects, get largest object
        // else add to formField builder
        // const dotParser = require('dot-object');
        // dotParser.keepArray = true;
        // const parsedData = dotParser.dot(obj);
        // let a = parsedData;
        // //reduce array of objects
        // for (let key in a) {
        //     let value = a[key];
        //     if (Array.isArray(value)) {
        //         if(this.isObjectArray(value)){
        //             const keyToValMap = value.reduce((map, el) => {
        //                 for(let k in el){
        //                     map[k] = el[k];
        //                 }
        //                 return map
        //               }, {})
        //             let objdot =dotParser.dot( {[key]:keyToValMap});
        //             for(let objkey in objdot){
        //                 a[objkey] = objdot[objkey];
        //             }
        //             delete a[key];
        //         }
        //     }
        // }
        // this.updateFields(Object.keys(a))
        // this.updateDbFields(Array.from(Object.keys(a).map((k) => k.replaceAll(".", "_"))))
        // this.jsonResult = dotParser.object(parsedData);
        // this.checkMap();
    }

    sanitizeData(obj:any, map?:any){
       map = map || {}
        Object.keys(obj).forEach(
            (key) => {
                if (
                    this.isArrayOrObject(obj[key]) &&
                    ((this.isObject(obj[key]) && !this.isEmptyObject(obj[key])) ||
                        (Array.isArray(obj[key]) && obj[key].length !== 0 && this.isObjectArray(obj[key]))) && (!obj[key]?.hasOwnProperty("ATTR")||!obj[key]?.hasOwnProperty("ID"))
                ) {

                    return this.sanitizeData(obj[key], obj)
                } else {
                    if(obj[key] !== null && (obj[key].hasOwnProperty("ATTR") || obj[key].hasOwnProperty("ID"))){
                        delete obj[key]
                        
                    }
                }
            }
        )
        return obj;
    }

    generateUris() {
        if (this.jsonTransformed !== undefined) {
            this.jsonUri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(this.jsonTransformed)));
            const rootKey = Object.keys(this.jsonTransformed)[0];
            // get mapping
            this.xmlUri = this.sanitizer.bypassSecurityTrustUrl("data:text/xml;charset=UTF-8," + encodeURIComponent(js2xml.parse(rootKey, this.jsonTransformed[rootKey])));
        }
    }
    parseData(event: Event) {

        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (fileList) {
            const doc = fileList.item(0);
            doc?.text().then(docText => {
                let jsonData: any | undefined;
                if (doc?.type.toLocaleLowerCase() == "text/xml") {
                    const parser = new xml2js.Parser({ trim: true, attrkey: "ATTR", charkey: "CHAR", explicitArray: false, preserveChildrenOrder: true });
                    parser.parseString(docText, (error, result) => {
                        if (error) {
                            alert(error)
                            return
                        }
                        if (result) {
                            jsonData = result
                        }

                    });
                } else {
                    jsonData = JSON.parse(docText);
                }
                if (jsonData != undefined) {
                    this.jsonExtracted = this.jsonToDot(jsonData);
                    const dotParser = require('dot-object');
                    this.jsonExtracted = dotParser.object(JSON.parse(JSON.stringify(this.jsonExtracted)));
                    // this.sanitizeData(this.jsonExtracted);
                    this.jsonExtractedDup = JSON.parse(JSON.stringify(this.jsonExtracted));
                    this.kdbMap  = this.updateFields(this.jsonExtracted);
                    this.checkMap();
                }
            });

        }
    }





}

