/********************************************************************************
** Form generated from reading UI file 'dialog_hotkey.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_HOTKEY_H
#define UI_DIALOG_HOTKEY_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QLabel>
#include "3rdparty/QtExtKeySequenceEdit.h"

QT_BEGIN_NAMESPACE

class Ui_DialogHotkey
{
public:
    QGridLayout *gridLayout;
    QtExtKeySequenceEdit *show_groups;
    QLabel *label_4;
    QtExtKeySequenceEdit *show_routes;
    QDialogButtonBox *buttonBox;
    QtExtKeySequenceEdit *show_mainwindow;
    QLabel *label_3;
    QLabel *label;
    QLabel *label_2;
    QtExtKeySequenceEdit *system_proxy;

    void setupUi(QDialog *DialogHotkey)
    {
        if (DialogHotkey->objectName().isEmpty())
            DialogHotkey->setObjectName(QString::fromUtf8("DialogHotkey"));
        DialogHotkey->resize(400, 300);
        gridLayout = new QGridLayout(DialogHotkey);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        show_groups = new QtExtKeySequenceEdit(DialogHotkey);
        show_groups->setObjectName(QString::fromUtf8("show_groups"));

        gridLayout->addWidget(show_groups, 1, 1, 1, 1);

        label_4 = new QLabel(DialogHotkey);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        gridLayout->addWidget(label_4, 2, 0, 1, 1);

        show_routes = new QtExtKeySequenceEdit(DialogHotkey);
        show_routes->setObjectName(QString::fromUtf8("show_routes"));

        gridLayout->addWidget(show_routes, 2, 1, 1, 1);

        buttonBox = new QDialogButtonBox(DialogHotkey);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setFocusPolicy(Qt::StrongFocus);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        gridLayout->addWidget(buttonBox, 4, 1, 1, 1);

        show_mainwindow = new QtExtKeySequenceEdit(DialogHotkey);
        show_mainwindow->setObjectName(QString::fromUtf8("show_mainwindow"));

        gridLayout->addWidget(show_mainwindow, 0, 1, 1, 1);

        label_3 = new QLabel(DialogHotkey);
        label_3->setObjectName(QString::fromUtf8("label_3"));

        gridLayout->addWidget(label_3, 1, 0, 1, 1);

        label = new QLabel(DialogHotkey);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 1);

        label_2 = new QLabel(DialogHotkey);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        gridLayout->addWidget(label_2, 3, 0, 1, 1);

        system_proxy = new QtExtKeySequenceEdit(DialogHotkey);
        system_proxy->setObjectName(QString::fromUtf8("system_proxy"));

        gridLayout->addWidget(system_proxy, 3, 1, 1, 1);

        QWidget::setTabOrder(show_mainwindow, show_groups);
        QWidget::setTabOrder(show_groups, show_routes);
        QWidget::setTabOrder(show_routes, system_proxy);
        QWidget::setTabOrder(system_proxy, buttonBox);

        retranslateUi(DialogHotkey);
        QObject::connect(buttonBox, SIGNAL(accepted()), DialogHotkey, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), DialogHotkey, SLOT(reject()));

        QMetaObject::connectSlotsByName(DialogHotkey);
    } // setupUi

    void retranslateUi(QDialog *DialogHotkey)
    {
        DialogHotkey->setWindowTitle(QCoreApplication::translate("DialogHotkey", "Hotkey", nullptr));
        label_4->setText(QCoreApplication::translate("DialogHotkey", "Show routes", nullptr));
        label_3->setText(QCoreApplication::translate("DialogHotkey", "Show groups", nullptr));
        label->setText(QCoreApplication::translate("DialogHotkey", "Trigger main window", nullptr));
        label_2->setText(QCoreApplication::translate("DialogHotkey", "System Proxy", nullptr));
    } // retranslateUi

};

namespace Ui {
    class DialogHotkey: public Ui_DialogHotkey {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_HOTKEY_H
