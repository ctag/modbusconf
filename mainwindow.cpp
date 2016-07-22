#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    num_devices = 0;

    connect(ui->spinBox_numDevices, SIGNAL(valueChanged(int)), this, SLOT(do_updateNumDevices()));
    connect(ui->comboBox_deviceProtocol, SIGNAL(currentIndexChanged(QString)), this, SLOT(do_updateProtocol(QString)));
    connect(ui->comboBox_currentDevice, SIGNAL(currentIndexChanged(QString)), this, SLOT(do_displayDeviceSettings()));

    connect(ui->comboBox_deviceProtocol, SIGNAL(currentIndexChanged(int)), this, SLOT(do_updateDevice()));
    connect(ui->lineEdit_deviceName, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->lineEdit_deviceAddress, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceCoilsSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceCoilsStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceDiscreteInputsSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceDiscreteInputsStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceHoldingRegistersSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceHoldingRegistersStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceInputRegistersSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceInputRegistersStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceIpPort, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceRtuBaudRate, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceRtuDataBits, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceRtuStopBits, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceSlaveID, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));

    do_updateNumDevices();

    ui->comboBox_deviceProtocol->clear();
    ui->comboBox_deviceProtocol->insertItem(0, "TCP", "TCP");
    ui->comboBox_deviceProtocol->insertItem(1, "RTU", "RTU");
    ui->comboBox_deviceProtocol->setCurrentIndex(0);

    ui->comboBox_deviceRtuParity->clear();
    ui->comboBox_deviceRtuParity->insertItem(0, "None", 'N');
    ui->comboBox_deviceRtuParity->insertItem(1, "Even", 'E');
    ui->comboBox_deviceRtuParity->insertItem(2, "Odd", 'O');
    ui->comboBox_deviceRtuParity->setCurrentIndex(0);


}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::deviceInstantiate(mbDevice * device, int index)
{
    device->name = "Default Slave";
    device->protocol = "TCP";
    device->slave_id = index+1;
    device->address = "192.168.23.1";
    device->IP_port = 502;
    device->RTU_Baud_Rate = 9600;
    device->RTU_Parity = 'N';
    device->RTU_Data_Bits = 8;
    device->RTU_Stop_Bits = 1;
    device->Discrete_Inputs_Start = 0;
    device->Discrete_Inputs_Size = 8;
    device->Coils_Start = 0;
    device->Coils_Size = 4;
    device->Input_Registers_Start = 0;
    device->Input_Registers_Size = 10;
    device->Holding_Registers_Start = 0;
    device->Holding_Registers_Size = 5;
}

void MainWindow::do_updateNumDevices()
{
    disconnect(ui->comboBox_currentDevice, SIGNAL(currentIndexChanged(QString)), this, SLOT(do_displayDeviceSettings()));
    int num = ui->spinBox_numDevices->value();
    devices.clear();
    ui->comboBox_currentDevice->clear();
    for (int index = 0; index < num; index++)
    {
        mbDevice newDevice;
        deviceInstantiate(&newDevice, index);
        devices.push_back(newDevice);
        ui->comboBox_currentDevice->insertItem(index, QString::number(index+1), index+1);
    }
    connect(ui->comboBox_currentDevice, SIGNAL(currentIndexChanged(QString)), this, SLOT(do_displayDeviceSettings()));
}

void MainWindow::do_updateProtocol(QString protocol)
{
    //QString protocol = ui->comboBox_deviceProtocol->currentData().toString();
    if (protocol == "TCP")
    {
        ui->spinBox_deviceRtuBaudRate->setEnabled(false);
        ui->comboBox_deviceRtuParity->setEnabled(false);
        ui->spinBox_deviceRtuDataBits->setEnabled(false);
        ui->spinBox_deviceRtuStopBits->setEnabled(false);
    }
    else
    {
        ui->spinBox_deviceRtuBaudRate->setEnabled(true);
        ui->comboBox_deviceRtuParity->setEnabled(true);
        ui->spinBox_deviceRtuDataBits->setEnabled(true);
        ui->spinBox_deviceRtuStopBits->setEnabled(true);
    }
}

void MainWindow::do_displayDeviceSettings()
{
    int index = ui->comboBox_currentDevice->currentIndex();
    mbDevice dev = devices.at(index);

    ui->lineEdit_deviceName->setText(dev.name);
    ui->comboBox_deviceProtocol->setCurrentText(dev.protocol);
    ui->spinBox_deviceSlaveID->setValue(dev.slave_id);
    ui->lineEdit_deviceAddress->setText(dev.address);
    ui->spinBox_deviceIpPort->setValue(dev.IP_port);
    ui->spinBox_deviceRtuBaudRate->setValue(dev.RTU_Baud_Rate);
    ui->comboBox_deviceRtuParity->setCurrentText(dev.RTU_Parity);
    ui->spinBox_deviceRtuDataBits->setValue(dev.RTU_Data_Bits);
    ui->spinBox_deviceRtuStopBits->setValue(dev.RTU_Stop_Bits);
    ui->spinBox_deviceDiscreteInputsStart->setValue(dev.Discrete_Inputs_Start);
    ui->spinBox_deviceDiscreteInputsSize->setValue(dev.Discrete_Inputs_Size);
    ui->spinBox_deviceCoilsStart->setValue(dev.Coils_Start);
    ui->spinBox_deviceCoilsSize->setValue(dev.Coils_Size);
    ui->spinBox_deviceInputRegistersStart->setValue(dev.Input_Registers_Start);
    ui->spinBox_deviceInputRegistersSize->setValue(dev.Input_Registers_Size);
    ui->spinBox_deviceHoldingRegistersStart->setValue(dev.Holding_Registers_Start);
    ui->spinBox_deviceHoldingRegistersSize->setValue(dev.Holding_Registers_Size);
}

void MainWindow::do_updateDevice()
{
    int index = ui->comboBox_currentDevice->currentIndex();
    mbDevice dev = devices.at(index);

    dev.name = ui->lineEdit_deviceName->text();
    dev.protocol = ui->comboBox_deviceProtocol->currentText();
    dev.slave_id = ui->spinBox_deviceSlaveID->value();
    dev.address = ui->lineEdit_deviceAddress->text();
    dev.IP_port = ui->spinBox_deviceIpPort->value();
    dev.RTU_Baud_Rate = ui->spinBox_deviceRtuBaudRate->value();
    dev.RTU_Parity = ui->comboBox_deviceRtuParity->currentData().toChar();
    dev.RTU_Data_Bits = ui->spinBox_deviceRtuDataBits->value();
    dev.RTU_Stop_Bits = ui->spinBox_deviceRtuStopBits->value();
    dev.Discrete_Inputs_Start = ui->spinBox_deviceDiscreteInputsStart->value();
    dev.Discrete_Inputs_Size = ui->spinBox_deviceDiscreteInputsSize->value();
    dev.Coils_Start = ui->spinBox_deviceCoilsStart->value();
    dev.Coils_Size = ui->spinBox_deviceCoilsSize->value();
    dev.Input_Registers_Start = ui->spinBox_deviceInputRegistersStart->value();
    dev.Input_Registers_Size = ui->spinBox_deviceInputRegistersSize->value();
    dev.Holding_Registers_Start = ui->spinBox_deviceHoldingRegistersStart->value();
    dev.Holding_Registers_Size = ui->spinBox_deviceHoldingRegistersSize->value();

    devices.replace(index, dev);
}
