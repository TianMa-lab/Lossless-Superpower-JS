/********************************************************************************
** Form generated from reading UI file 'edit_socks_http.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_SOCKS_HTTP_H
#define UI_EDIT_SOCKS_HTTP_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_EditSocksHttp
{
public:
    QGridLayout *gridLayout;
    QLabel *version_l;
    QLineEdit *username;
    QLineEdit *password;
    QLabel *label_4;
    QComboBox *version;
    QLabel *label_5;

    void setupUi(QWidget *EditSocksHttp)
    {
        if (EditSocksHttp->objectName().isEmpty())
            EditSocksHttp->setObjectName(QString::fromUtf8("EditSocksHttp"));
        EditSocksHttp->resize(400, 300);
        EditSocksHttp->setWindowTitle(QString::fromUtf8("Form"));
        gridLayout = new QGridLayout(EditSocksHttp);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        version_l = new QLabel(EditSocksHttp);
        version_l->setObjectName(QString::fromUtf8("version_l"));

        gridLayout->addWidget(version_l, 0, 0, 1, 1);

        username = new QLineEdit(EditSocksHttp);
        username->setObjectName(QString::fromUtf8("username"));

        gridLayout->addWidget(username, 1, 1, 1, 1);

        password = new QLineEdit(EditSocksHttp);
        password->setObjectName(QString::fromUtf8("password"));

        gridLayout->addWidget(password, 2, 1, 1, 1);

        label_4 = new QLabel(EditSocksHttp);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        gridLayout->addWidget(label_4, 1, 0, 1, 1);

        version = new QComboBox(EditSocksHttp);
        version->addItem(QString::fromUtf8("5"));
        version->addItem(QString::fromUtf8("4"));
        version->setObjectName(QString::fromUtf8("version"));

        gridLayout->addWidget(version, 0, 1, 1, 1);

        label_5 = new QLabel(EditSocksHttp);
        label_5->setObjectName(QString::fromUtf8("label_5"));

        gridLayout->addWidget(label_5, 2, 0, 1, 1);

        QWidget::setTabOrder(version, username);
        QWidget::setTabOrder(username, password);

        retranslateUi(EditSocksHttp);

        QMetaObject::connectSlotsByName(EditSocksHttp);
    } // setupUi

    void retranslateUi(QWidget *EditSocksHttp)
    {
        version_l->setText(QCoreApplication::translate("EditSocksHttp", "Version", nullptr));
        label_4->setText(QCoreApplication::translate("EditSocksHttp", "Username", nullptr));

        label_5->setText(QCoreApplication::translate("EditSocksHttp", "Password", nullptr));
        (void)EditSocksHttp;
    } // retranslateUi

};

namespace Ui {
    class EditSocksHttp: public Ui_EditSocksHttp {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_SOCKS_HTTP_H
