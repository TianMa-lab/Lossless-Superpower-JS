/********************************************************************************
** Form generated from reading UI file 'edit_naive.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_NAIVE_H
#define UI_EDIT_NAIVE_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_EditNaive
{
public:
    QGridLayout *gridLayout;
    QLabel *label;
    MyLineEdit *username;
    QLabel *label_2;
    MyLineEdit *password;
    QLabel *label_3;
    QComboBox *protocol;
    QLabel *label_4;
    QPushButton *extra_headers;
    QLabel *label_6;
    MyLineEdit *sni;
    QLabel *label_7;
    QPushButton *certificate;
    QLabel *label_5;
    MyLineEdit *insecure_concurrency;
    QLabel *label_8;
    QCheckBox *disable_log;

    void setupUi(QWidget *EditNaive)
    {
        if (EditNaive->objectName().isEmpty())
            EditNaive->setObjectName(QString::fromUtf8("EditNaive"));
        EditNaive->resize(525, 304);
        EditNaive->setWindowTitle(QString::fromUtf8("EditNaive"));
        gridLayout = new QGridLayout(EditNaive);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        label = new QLabel(EditNaive);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 1);

        username = new MyLineEdit(EditNaive);
        username->setObjectName(QString::fromUtf8("username"));

        gridLayout->addWidget(username, 0, 1, 1, 1);

        label_2 = new QLabel(EditNaive);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        gridLayout->addWidget(label_2, 1, 0, 1, 1);

        password = new MyLineEdit(EditNaive);
        password->setObjectName(QString::fromUtf8("password"));

        gridLayout->addWidget(password, 1, 1, 1, 1);

        label_3 = new QLabel(EditNaive);
        label_3->setObjectName(QString::fromUtf8("label_3"));

        gridLayout->addWidget(label_3, 2, 0, 1, 1);

        protocol = new QComboBox(EditNaive);
        protocol->addItem(QString::fromUtf8("https"));
        protocol->addItem(QString::fromUtf8("quic"));
        protocol->setObjectName(QString::fromUtf8("protocol"));

        gridLayout->addWidget(protocol, 2, 1, 1, 1);

        label_4 = new QLabel(EditNaive);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        gridLayout->addWidget(label_4, 3, 0, 1, 1);

        extra_headers = new QPushButton(EditNaive);
        extra_headers->setObjectName(QString::fromUtf8("extra_headers"));
        extra_headers->setText(QString::fromUtf8("PushButton"));

        gridLayout->addWidget(extra_headers, 3, 1, 1, 1);

        label_6 = new QLabel(EditNaive);
        label_6->setObjectName(QString::fromUtf8("label_6"));

        gridLayout->addWidget(label_6, 4, 0, 1, 1);

        sni = new MyLineEdit(EditNaive);
        sni->setObjectName(QString::fromUtf8("sni"));

        gridLayout->addWidget(sni, 4, 1, 1, 1);

        label_7 = new QLabel(EditNaive);
        label_7->setObjectName(QString::fromUtf8("label_7"));

        gridLayout->addWidget(label_7, 5, 0, 1, 1);

        certificate = new QPushButton(EditNaive);
        certificate->setObjectName(QString::fromUtf8("certificate"));
        certificate->setText(QString::fromUtf8("PushButton"));

        gridLayout->addWidget(certificate, 5, 1, 1, 1);

        label_5 = new QLabel(EditNaive);
        label_5->setObjectName(QString::fromUtf8("label_5"));

        gridLayout->addWidget(label_5, 6, 0, 1, 1);

        insecure_concurrency = new MyLineEdit(EditNaive);
        insecure_concurrency->setObjectName(QString::fromUtf8("insecure_concurrency"));

        gridLayout->addWidget(insecure_concurrency, 6, 1, 1, 1);

        label_8 = new QLabel(EditNaive);
        label_8->setObjectName(QString::fromUtf8("label_8"));

        gridLayout->addWidget(label_8, 7, 0, 1, 1);

        disable_log = new QCheckBox(EditNaive);
        disable_log->setObjectName(QString::fromUtf8("disable_log"));

        gridLayout->addWidget(disable_log, 7, 1, 1, 1);


        retranslateUi(EditNaive);

        QMetaObject::connectSlotsByName(EditNaive);
    } // setupUi

    void retranslateUi(QWidget *EditNaive)
    {
        label->setText(QCoreApplication::translate("EditNaive", "Username", nullptr));
        label_2->setText(QCoreApplication::translate("EditNaive", "Password", nullptr));
        label_3->setText(QCoreApplication::translate("EditNaive", "Protocol", nullptr));

        label_4->setText(QCoreApplication::translate("EditNaive", "Extra headers", nullptr));
        label_6->setText(QCoreApplication::translate("EditNaive", "SNI", nullptr));
        label_7->setText(QCoreApplication::translate("EditNaive", "Certificate", nullptr));
        label_5->setText(QCoreApplication::translate("EditNaive", "Insecure concurrency", nullptr));
        label_8->setText(QCoreApplication::translate("EditNaive", "Disable logs", nullptr));
        disable_log->setText(QCoreApplication::translate("EditNaive", "Turn on this option if your connection is lost after a while", nullptr));
        (void)EditNaive;
    } // retranslateUi

};

namespace Ui {
    class EditNaive: public Ui_EditNaive {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_NAIVE_H
