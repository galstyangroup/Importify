/* map external fields to internalfields
Provide an element as 'appendElm' and any json object, 
this function will let you map internal fields to any type of external data.
====================
internalFields eg: 
    [{
        name: "Organisation",
        type: "select",
        default: "externalName"
    }, ... }]

*/

class Importyfi {
    constructor(appendElm, internalFields, externalData, previewColumns) {
      this._internalFields = internalFields;
      this._externalData = externalData;
      this._previewColumns = previewColumns;
      this._appendElm = appendElm;
    }

    collect() {

    } 
  
    mapFields() {

        function extTemplate(x, devaultValue) {
            let selected;

            devaultValue ==! null ? selected = "selected" : selected = "";
            const fieldnames = Object.keys(x); 
            const options =  fieldnames.map((z) => {
                return `<option ${selected}>${z}</option>`;
            });
            
            return options;
        }
    
        function internalTempl(x) {
            x.default !== null || x.default !== undefined ? x.defaultValue = x.default : x.defaultValue = "";
            return `<div class="fieldItem">
                    <label for="${x.name}">${x.name}</label> 
                    <select class="selectpicker" data-live-search="true" name="${x.name}" id="${x.name}" value="${x.defaultValue}">
                        <option> ${getText["select"]}</option>
                        ${this._externalData.map((x) => {return extTemplate(x, x.default)}).join("") }
                    </select>
                </div>`;
        };
    
        $(this_appendElm).append(`<div class="FielsContainer">
                     <h2>${getText["step"]} 2 </h2>
                            ${internalFields.map(internalTempl).join("")}
                    </div> 
                    <button onclick="showDataPreView()" class="btn btn-success form-control pull-right">${getText["show_data_preview"]}</button> 
                    <span class="clearfix"></span>
        `);
    
        FormRender();
    }

    // preview the data to the user
    preview() {
        let intDataObj = new Array;
        for (var x = 0; x < externalData.length; x++) {
            let importModel = new Object;
            for (var i = 0; i < internalFields.length; i++) {
                let value = externalData[x][$(`[name="${internalFields[i].name}"]`).val()];
                let RenderValue;
                value != undefined || value != null ? RenderValue = value : RenderValue = "";
                importModel[internalFields[i].name] = RenderValue;
            }
            intDataObj.push(importModel);
        }
    
        $("#externalDataContainer").append(`
            <h2>${getText["step"]} 3 </h2>
            <div class="table-responsive">
                <table id="dataPreviewTable" class="table table-hover display" width="100%"></table>
            </div>    
            <button onclick="Import()" class="btn btn-success pull-right form-control">${getText["import"]}</button>
            <span class="clearfix"></span>
        `);
    
        $('#dataPreviewTable').DataTable({
            "data": intDataObj,
            "destroy": true,
            "info": false,
            "searching": false,
            "ordering": false,
            "paging": false,
            columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            }],
            select: {
                style: 'multi',
                selector: 'td:first-child'
            },
            "columns": [{
                    "title": "<input type=\"checkbox\"></input>",
                    defaultContent: ""
                },
    
            ]
        });
    
    }

    Import() {
        let intDataObj = new Array;
        for (var x = 0; x < externalData.length; x++) {
            let importModel = new Object;
            for (var i = 0; i < internalFields.length; i++) {
                let value = externalData[x][$(`[name="${internalFields[i].name}"]`).val()]
                importModel[internalFields[i].name] = value !== null || value !== undefined ? value : null;
            }
            intDataObj.push(importModel);
        }
    
        // //////////// posting data to internal api
    
        let url = "/apiimportprojects/import";
        let success = function (e) {
            refreshView();
            $('#exampleModal').hide('hide');
            filterShow(this, 3)
        }
    
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(intDataObj),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: success,
            fail: function (e) {
                console.log(e);
            }
        });
    }
}
