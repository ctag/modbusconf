#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QString>
#include <QList>

struct mbDevice {
    QString name;
    QString protocol;
    int slave_id;
    QString address;
    int IP_port;
    int RTU_Baud_Rate;
    int RTU_Parity;
    int RTU_Data_Bits;
    int RTU_Stop_Bits;
    int Discrete_Inputs_Start;
    int Descrete_Inputs_Size;
    int Coils_Start;
    int Coils_Size;
    int Input_Registers_Start;
    int Input_Registers_Size;
    int Holding_Registers_Start;
    int Holding_Registers_Size;
};

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void do_updateNumDevices();
    void do_updateProtocol();

private:
    Ui::MainWindow *ui;
    QList<mbDevice> devices;
    int num_devices;
};

#endif // MAINWINDOW_H
