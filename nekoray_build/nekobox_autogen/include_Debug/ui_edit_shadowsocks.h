/********************************************************************************
** Form generated from reading UI file 'edit_shadowsocks.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_SHADOWSOCKS_H
#define UI_EDIT_SHADOWSOCKS_H

#include <QtCore/QLocale>
#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_EditShadowSocks
{
public:
    QGridLayout *gridLayout;
    QComboBox *method;
    MyLineEdit *password;
    QLabel *plugin_l;
    QLabel *label;
    QLabel *plugin_opts_l;
    MyLineEdit *plugin_opts;
    QLabel *label_5;
    QComboBox *plugin;
    QLabel *uot_l;
    QComboBox *uot;

    void setupUi(QWidget *EditShadowSocks)
    {
        if (EditShadowSocks->objectName().isEmpty())
            EditShadowSocks->setObjectName(QString::fromUtf8("EditShadowSocks"));
        EditShadowSocks->resize(400, 300);
        EditShadowSocks->setWindowTitle(QString::fromUtf8("Form"));
        gridLayout = new QGridLayout(EditShadowSocks);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        method = new QComboBox(EditShadowSocks);
        method->setObjectName(QString::fromUtf8("method"));
        method->setEditable(true);

        gridLayout->addWidget(method, 0, 1, 1, 1);

        password = new MyLineEdit(EditShadowSocks);
        password->setObjectName(QString::fromUtf8("password"));

        gridLayout->addWidget(password, 1, 1, 1, 1);

        plugin_l = new QLabel(EditShadowSocks);
        plugin_l->setObjectName(QString::fromUtf8("plugin_l"));

        gridLayout->addWidget(plugin_l, 2, 0, 1, 1);

        label = new QLabel(EditShadowSocks);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 1);

        plugin_opts_l = new QLabel(EditShadowSocks);
        plugin_opts_l->setObjectName(QString::fromUtf8("plugin_opts_l"));

        gridLayout->addWidget(plugin_opts_l, 3, 0, 1, 1);

        plugin_opts = new MyLineEdit(EditShadowSocks);
        plugin_opts->setObjectName(QString::fromUtf8("plugin_opts"));

        gridLayout->addWidget(plugin_opts, 3, 1, 1, 1);

        label_5 = new QLabel(EditShadowSocks);
        label_5->setObjectName(QString::fromUtf8("label_5"));

        gridLayout->addWidget(label_5, 1, 0, 1, 1);

        plugin = new QComboBox(EditShadowSocks);
        plugin->addItem(QString());
        plugin->addItem(QString::fromUtf8("obfs-local"));
        plugin->addItem(QString::fromUtf8("v2ray-plugin"));
        plugin->setObjectName(QString::fromUtf8("plugin"));

        gridLayout->addWidget(plugin, 2, 1, 1, 1);

        uot_l = new QLabel(EditShadowSocks);
        uot_l->setObjectName(QString::fromUtf8("uot_l"));
        uot_l->setLocale(QLocale(QLocale::English, QLocale::UnitedStates));
        uot_l->setText(QString::fromUtf8("UoT"));

        gridLayout->addWidget(uot_l, 4, 0, 1, 1);

        uot = new QComboBox(EditShadowSocks);
        uot->addItem(QString());
        uot->addItem(QString::fromUtf8("1"));
        uot->addItem(QString::fromUtf8("2"));
        uot->setObjectName(QString::fromUtf8("uot"));

        gridLayout->addWidget(uot, 4, 1, 1, 1);

        QWidget::setTabOrder(method, password);
        QWidget::setTabOrder(password, plugin);
        QWidget::setTabOrder(plugin, plugin_opts);

        retranslateUi(EditShadowSocks);

        QMetaObject::connectSlotsByName(EditShadowSocks);
    } // setupUi

    void retranslateUi(QWidget *EditShadowSocks)
    {
        plugin_l->setText(QCoreApplication::translate("EditShadowSocks", "Plugin", nullptr));
        label->setText(QCoreApplication::translate("EditShadowSocks", "Encryption", nullptr));
        plugin_opts_l->setText(QCoreApplication::translate("EditShadowSocks", "Plugin Args", nullptr));
        label_5->setText(QCoreApplication::translate("EditShadowSocks", "Password", nullptr));
        plugin->setItemText(0, QString());

#if QT_CONFIG(tooltip)
        uot_l->setToolTip(QCoreApplication::translate("EditShadowSocks", "Version of UDP over TCP protocol, server support is required.", nullptr));
#endif // QT_CONFIG(tooltip)
        uot->setItemText(0, QCoreApplication::translate("EditShadowSocks", "Off", nullptr));

        (void)EditShadowSocks;
    } // retranslateUi

};

namespace Ui {
    class EditShadowSocks: public Ui_EditShadowSocks {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_SHADOWSOCKS_H
