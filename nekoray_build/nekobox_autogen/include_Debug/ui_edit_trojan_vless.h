/********************************************************************************
** Form generated from reading UI file 'edit_trojan_vless.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_TROJAN_VLESS_H
#define UI_EDIT_TROJAN_VLESS_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_EditTrojanVLESS
{
public:
    QGridLayout *gridLayout;
    MyLineEdit *password;
    QLabel *label;
    QLabel *flow_l;
    QComboBox *flow;

    void setupUi(QWidget *EditTrojanVLESS)
    {
        if (EditTrojanVLESS->objectName().isEmpty())
            EditTrojanVLESS->setObjectName(QString::fromUtf8("EditTrojanVLESS"));
        EditTrojanVLESS->resize(400, 300);
        EditTrojanVLESS->setWindowTitle(QString::fromUtf8(""));
        gridLayout = new QGridLayout(EditTrojanVLESS);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        password = new MyLineEdit(EditTrojanVLESS);
        password->setObjectName(QString::fromUtf8("password"));

        gridLayout->addWidget(password, 0, 1, 1, 1);

        label = new QLabel(EditTrojanVLESS);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 1);

        flow_l = new QLabel(EditTrojanVLESS);
        flow_l->setObjectName(QString::fromUtf8("flow_l"));
        flow_l->setText(QString::fromUtf8("Flow"));

        gridLayout->addWidget(flow_l, 1, 0, 1, 1);

        flow = new QComboBox(EditTrojanVLESS);
        flow->addItem(QString::fromUtf8(""));
        flow->setObjectName(QString::fromUtf8("flow"));

        gridLayout->addWidget(flow, 1, 1, 1, 1);


        retranslateUi(EditTrojanVLESS);

        QMetaObject::connectSlotsByName(EditTrojanVLESS);
    } // setupUi

    void retranslateUi(QWidget *EditTrojanVLESS)
    {
        label->setText(QCoreApplication::translate("EditTrojanVLESS", "Password", nullptr));

        (void)EditTrojanVLESS;
    } // retranslateUi

};

namespace Ui {
    class EditTrojanVLESS: public Ui_EditTrojanVLESS {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_TROJAN_VLESS_H
