/********************************************************************************
** Form generated from reading UI file 'edit_vmess.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_VMESS_H
#define UI_EDIT_VMESS_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_EditVMess
{
public:
    QGridLayout *gridLayout;
    QComboBox *security;
    QLabel *label_3;
    QLabel *label_2;
    QLabel *label;
    MyLineEdit *uuid;
    QWidget *horizontalWidget;
    QHBoxLayout *horizontalLayout;
    QLineEdit *aid;
    QPushButton *uuidgen;

    void setupUi(QWidget *EditVMess)
    {
        if (EditVMess->objectName().isEmpty())
            EditVMess->setObjectName(QString::fromUtf8("EditVMess"));
        EditVMess->resize(400, 300);
        EditVMess->setWindowTitle(QString::fromUtf8("EditVMess"));
        gridLayout = new QGridLayout(EditVMess);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        security = new QComboBox(EditVMess);
        security->addItem(QString::fromUtf8("auto"));
        security->addItem(QString::fromUtf8("zero"));
        security->addItem(QString::fromUtf8("none"));
        security->addItem(QString::fromUtf8("chacha20-poly1305"));
        security->addItem(QString::fromUtf8("aes-128-gcm"));
        security->setObjectName(QString::fromUtf8("security"));
        security->setEditable(true);

        gridLayout->addWidget(security, 4, 1, 1, 1);

        label_3 = new QLabel(EditVMess);
        label_3->setObjectName(QString::fromUtf8("label_3"));

        gridLayout->addWidget(label_3, 4, 0, 1, 1);

        label_2 = new QLabel(EditVMess);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        gridLayout->addWidget(label_2, 3, 0, 1, 1);

        label = new QLabel(EditVMess);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 1);

        uuid = new MyLineEdit(EditVMess);
        uuid->setObjectName(QString::fromUtf8("uuid"));

        gridLayout->addWidget(uuid, 0, 1, 1, 1);

        horizontalWidget = new QWidget(EditVMess);
        horizontalWidget->setObjectName(QString::fromUtf8("horizontalWidget"));
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Maximum);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(horizontalWidget->sizePolicy().hasHeightForWidth());
        horizontalWidget->setSizePolicy(sizePolicy);
        horizontalLayout = new QHBoxLayout(horizontalWidget);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        aid = new QLineEdit(horizontalWidget);
        aid->setObjectName(QString::fromUtf8("aid"));

        horizontalLayout->addWidget(aid);

        uuidgen = new QPushButton(horizontalWidget);
        uuidgen->setObjectName(QString::fromUtf8("uuidgen"));

        horizontalLayout->addWidget(uuidgen);


        gridLayout->addWidget(horizontalWidget, 3, 1, 1, 1);

        QWidget::setTabOrder(uuid, aid);
        QWidget::setTabOrder(aid, uuidgen);
        QWidget::setTabOrder(uuidgen, security);

        retranslateUi(EditVMess);

        QMetaObject::connectSlotsByName(EditVMess);
    } // setupUi

    void retranslateUi(QWidget *EditVMess)
    {

        label_3->setText(QCoreApplication::translate("EditVMess", "Security", nullptr));
        label_2->setText(QCoreApplication::translate("EditVMess", "Alter Id", nullptr));
        label->setText(QCoreApplication::translate("EditVMess", "UUID", nullptr));
        uuidgen->setText(QCoreApplication::translate("EditVMess", "Generate UUID", nullptr));
        (void)EditVMess;
    } // retranslateUi

};

namespace Ui {
    class EditVMess: public Ui_EditVMess {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_VMESS_H
