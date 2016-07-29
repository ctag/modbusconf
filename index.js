// Global variables
var devices = [];
var elems = {};

// Global variable instantiation
elems.button_download = document.getElementById('button_download');
elems.button_openFile = document.getElementById('button_openFile');
elems.button_list_new = document.getElementById('config_list_new');
elems.config_values_input = document.getElementsByClassName('config_values_input');
elems.config_rtu = document.getElementsByClassName('config_rtu');

//
// Helper functions
//

function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}

function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}

function addEvent(el, type, handler) {
    if (el.attachEvent) el.attachEvent('on' + type, handler);
    else el.addEventListener(type, handler);
}

function removeEvent(el, type, handler) {
    if (el.detachEvent) el.detachEvent('on' + type, handler);
    else el.removeEventListener(type, handler);
}

//
// modbusconf functions
//

// Create a new device
function instantiate_new() {
    var dev = {};
    dev.name = "New Device";
    dev.protocol = "TCP";
    if (devices.length) {
        dev.slave_id = devices.length;
    }
    else {
        dev.slave_id = 0;
    }
    dev.address = "192.168.23.1";
    dev.IP_Port = 502;
    dev.RTU_Baud_Rate = 9600;
    dev.RTU_Parity = "N";
    dev.RTU_Data_Bits = 8;
    dev.RTU_Stop_Bits = 1;
    dev.Discrete_Inputs_Start = 0;
    dev.Discrete_Inputs_Size = 8;
    dev.Coils_Start = 0;
    dev.Coils_Size = 4;
    dev.Input_Registers_Start = 0;
    dev.Input_Registers_Size = 10;
    dev.Holding_Registers_Start = 0;
    dev.Holding_Registers_Size = 5;
    return dev;
}

function get_title(dev) {
    var text = dev.slave_id + " - " + dev.name;
    return text;
}

function get_dev(text) {
    for (var dev in devices) {
        var compare = get_title(devices[dev]);
        if (compare === text) {
            return dev;
        }
    }
}

function update_list() {
    console.log('updating list');
    var list = document.getElementById('config_list');
    var delme;
    delme = document.getElementsByClassName('config_list_item');
    while (delme[0] !== undefined) {
        console.log('Deleting: ', delme[0]);
        delme[0].parentNode.removeChild(delme[0]);
        delme = document.getElementsByClassName('config_list_item');
    }
    for (var dev in devices) {
        //        console.log(devices[dev]);
        var newelem = document.createElement('div');
        newelem.setAttribute('id', 'device_' + devices[dev].slave_id);
        newelem.innerHTML = get_title(devices[dev]);
        addClass(newelem, 'config_list_item');
        list.appendChild(newelem);
    }
    setup_click_list_item();
}

function parseConfigFile(contents) {
    devices = [];
    var text = contents.split('\n');
    var reg = {};
    reg.name = /^device(\d+)\.name.*"(.*)"/;
    reg.protocol = /^device(\d+)\.protocol.*"(.*)"$/;
    reg.slave_id = /^device(\d+)\.slave_id.*"(.*)"$/;
    reg.address = /^device(\d+)\.address.*"(.*)"$/;
    reg.IP_Port = /^device(\d+)\.IP_Port.*"(.*)"$/;
    reg.RTU_Baud_Rate = /^device(\d+)\.RTU_Baud_Rate.*"(.*)"$/;
    reg.RTU_Parity = /^device(\d+)\.RTU_Parity.*"(.*)"$/;
    reg.RTU_Data_Bits = /^device(\d+)\.RTU_Data_Bits.*"(.*)"$/;
    reg.RTU_Stop_Bits = /^device(\d+)\.RTU_Stop_Bits.*"(.*)"$/;
    reg.Discrete_Inputs_Start = /^device(\d+)\.Discrete_Inputs_Start.*"(.*)"$/;
    reg.Discrete_Inputs_Size = /^device(\d+)\.Discrete_Inputs_Size.*"(.*)"$/;
    reg.Coils_Start = /^device(\d+)\.Coils_Start.*"(.*)"$/;
    reg.Coils_Size = /^device(\d+)\.Coils_Size.*"(.*)"$/;
    reg.Input_Registers_Start = /^device(\d+)\.Input_Registers_Start.*"(.*)"$/;
    reg.Input_Registers_Size = /^device(\d+)\.Input_Registers_Size.*"(.*)"$/;
    reg.Holding_Registers_Start = /^device(\d+)\.Holding_Registers_Start.*"(.*)"$/;
    reg.Holding_Registers_Size = /^device(\d+)\.Holding_Registers_Size.*"(.*)"$/;
    for (var line in text) {
        var dev;
        for (var param in reg) {
            var result = reg[param].exec(text[line]);
            if (result) {
                /* 0 - full match
                 * 1 - device number
                 * 2 - param value
                 * (1*string) creates a number
                 */
                dev = 1 * result[1];
                console.log(line, dev, param, result);
                if (typeof (devices[dev]) !== 'object') {
                    devices[dev] = {};
                }
                devices[dev][param] = result[2];
            }
        }
    }
    for (var dev in devices) {
        if (devices[dev].protocol === 'TCP') {
            devices[dev].RTU_Baud_Rate = 9600;
            devices[dev].RTU_Parity = 'N';
            devices[dev].RTU_Data_Bits = 8;
            devices[dev].RTU_Stop_Bits = 1;
        }
    }
    update_list();
    update_preview();
}

function set_values(dev) {
    document.getElementById('device-name').value = dev.name;
    document.getElementById('device-protocol').value = dev.protocol;
    document.getElementById('device-id').value = dev.slave_id;
    document.getElementById('device-address').value = dev.address;
    document.getElementById('device-port').value = dev.IP_Port;
    document.getElementById('device-rtu-baud').value = dev.RTU_Baud_Rate;
    document.getElementById('device-rtu-parity').value = dev.RTU_Parity;
    document.getElementById('device-rtu-data').value = dev.RTU_Data_Bits;
    document.getElementById('device-rtu-stop').value = dev.RTU_Stop_Bits;
    document.getElementById('device-input-registers-start').value = dev.Input_Registers_Start;
    document.getElementById('device-input-registers-size').value = dev.Input_Registers_Size;
    document.getElementById('device-coils-start').value = dev.Coils_Start;
    document.getElementById('device-coils-size').value = dev.Coils_Size;
    document.getElementById('device-input-registers-start').value = dev.Input_Registers_Start;
    document.getElementById('device-input-registers-size').value = dev.Input_Registers_Size;
    document.getElementById('device-holding-registers-start').value = dev.Holding_Registers_Start;
    document.getElementById('device-holding-registers-size').value = dev.Holding_Registers_Size;
    update_protocol(document.getElementById('device-protocol').value);
}

function update_protocol(protocol) {
    console.log("Running update protocol.", protocol);
    for (var index = 0; index < elems.config_rtu.length; index++) {
        if (protocol === "TCP") {
            elems.config_rtu[index].setAttribute('disabled', true);
            elems.config_rtu[index].style.color = '#040';
        }
        else {
            elems.config_rtu[index].removeAttribute('disabled');
            elems.config_rtu[index].style.color = '#3f3';
        }
    }
}

function create_config() {
    var text = 'Num_Devices = "' + devices.length + '" \n';
    for (var dev in devices) {
        var prefix = 'device' + dev;
        text += '\n# ------------\n';
        text += '#   DEVICE ' + dev + '\n';
        text += '# ------------\n';
        text += prefix + '.name = "' + devices[dev].name + '"\n';
        text += prefix + '.protocol = "' + devices[dev].protocol + '"\n';
        text += prefix + '.slave_id = "' + devices[dev].slave_id + '"\n';
        text += prefix + '.address = "' + devices[dev].address + '"\n';
        text += prefix + '.IP_Port = "' + devices[dev].IP_Port + '"\n';
        if (devices[dev].protocol === "TCP") {
            text += prefix + '.RTU_Baud_Rate = ""\n';
            text += prefix + '.RTU_Parity = ""\n';
            text += prefix + '.RTU_Data_Bits = ""\n';
            text += prefix + '.RTU_Stop_Bits = ""\n';
        }
        else {
            text += prefix + '.RTU_Baud_Rate = "' + devices[dev].RTU_Baud_Rate + '"\n';
            text += prefix + '.RTU_Parity = "' + devices[dev].RTU_Parity + '"\n';
            text += prefix + '.RTU_Data_Bits = "' + devices[dev].RTU_Data_Bits + '"\n';
            text += prefix + '.RTU_Stop_Bits = "' + devices[dev].RTU_Stop_Bits + '"\n';
        }
        text += prefix + '.Discrete_Inputs_Start = "' + devices[dev].Discrete_Inputs_Start + '"\n';
        text += prefix + '.Discrete_Inputs_Size = "' + devices[dev].Discrete_Inputs_Size + '"\n';
        text += prefix + '.Coils_Start = "' + devices[dev].Coils_Start + '"\n';
        text += prefix + '.Coils_Size = "' + devices[dev].Coils_Size + '"\n';
        text += prefix + '.Input_Registers_Start = "' + devices[dev].Input_Registers_Start + '"\n';
        text += prefix + '.Input_Registers_Size = "' + devices[dev].Input_Registers_Size + '"\n';
        text += prefix + '.Holding_Registers_Start = "' + devices[dev].Holding_Registers_Start + '"\n';
        text += prefix + '.Holding_Registers_Size = "' + devices[dev].Holding_Registers_Size + '"\n';
    }
    return (text);
}

function update_preview() {
    document.getElementById('config_preview').innerHTML = create_config().replace(/\n/g, '\n<br>');
}

//
// Events
//

// Param changed
function handler_config_values_input(e) {
    var selected = document.getElementsByClassName('config_list_item_selected')[0];
    var dev = get_dev(selected.textContent);
    var text;
    if (document.getElementById('device-name').value !== devices[dev].name) {
        devices[dev].name = document.getElementById('device-name').value;
        text = get_title(devices[dev]);
        selected.textContent = text;
    }
    if (document.getElementById('device-id').value !== devices[dev].slave_id) {
        devices[dev].slave_id = document.getElementById('device-id').value;
        text = get_title(devices[dev]);
        selected.textContent = text;
    }
    devices[dev].IP_Port = document.getElementById('device-port').value;
    devices[dev].protocol = document.getElementById('device-protocol').value;
    devices[dev].address = document.getElementById('device-address').value;
    devices[dev].RTU_Baud_Rate = document.getElementById('device-rtu-baud').value;
    devices[dev].RTU_Parity = document.getElementById('device-rtu-parity').value;
    devices[dev].RTU_Data_Bits = document.getElementById('device-rtu-data').value;
    devices[dev].RTU_Stop_Bits = document.getElementById('device-rtu-stop').value;
    devices[dev].Input_Registers_Start = document.getElementById('device-input-registers-start').value;
    devices[dev].Input_Registers_Size = document.getElementById('device-input-registers-size').value;
    devices[dev].Coils_Start = document.getElementById('device-coils-start').value;
    devices[dev].Coils_Size = document.getElementById('device-coils-size').value;
    devices[dev].Input_Registers_Start = document.getElementById('device-input-registers-start').value;
    devices[dev].Input_Registers_Size = document.getElementById('device-input-registers-size').value;
    devices[dev].Holding_Registers_Start = document.getElementById('device-holding-registers-start').value;
    devices[dev].Holding_Registers_Size = document.getElementById('device-holding-registers-size').value;
    update_protocol(document.getElementById('device-protocol').value);
    update_preview();
}
for (var index = 0; index < elems.config_values_input.length; index++) {
    var element = elems.config_values_input.item(index);
    if (element.attachEvent) element.attachEvent('onchange', handler_config_values_input);
    else element.addEventListener('change', handler_config_values_input);
}

// Item clicked
function handler_list_item_selected(e) {
    var text = e.target.textContent;
    var elements = document.getElementsByClassName('config_list_item');
    for (var index = 0; index < elements.length; index++) {
        removeClass(elements[index], 'config_list_item_selected');
    }
    for (var dev in devices) {
        var compare = get_title(devices[dev]);
        if (compare === text) {
            set_values(devices[dev]);
            addClass(e.srcElement, 'config_list_item_selected');
            break;
        }
    }
}

function setup_click_list_item() {
    var elements = document.getElementsByClassName('config_list_item');
    for (var index = 0; index < elements.length; index++) {
        addEvent(elements[index], 'click', handler_list_item_selected);
    }
}

// Upload button
function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        parseConfigFile(contents);
    };
    reader.readAsText(file);
}
function handler_button_openFile(e) {
    var element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.setAttribute('id', 'temp_openFile');
    element.style.display = 'none';
    document.body.appendChild(element);
    addEvent(element, 'change', readSingleFile);
    element.click();
    document.body.removeChild(element);
}
addEvent(elems.button_openFile, 'click', handler_button_openFile);

// Download button
function download(filename, text) {
    console.log("Doing download");
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function handler_button_download(e) {
    download("modbusdevice.cfg", create_config());
}
if (elems.button_download.attachEvent) elems.button_download.attachEvent('onclick', handler_button_download);
else elems.button_download.addEventListener('click', handler_button_download);

// New device button
function handler_list_new(e) {
    devices.push(instantiate_new());
    console.log(devices);
    update_list();
    update_preview();
}
if (elems.button_list_new.attachEvent) elems.button_list_new.attachEvent('onclick', handler_list_new);
else elems.button_list_new.addEventListener('click', handler_list_new);