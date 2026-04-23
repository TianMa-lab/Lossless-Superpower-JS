/********************************************************************************
** Form generated from reading UI file 'ProxyItem.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_PROXYITEM_H
#define UI_PROXYITEM_H

#include <QtCore/QVariant>
#include <QtGui/QIcon>
#include <QtWidgets/QApplication>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_ProxyItem
{
public:
    QVBoxLayout *verticalLayout_2;
    QHBoxLayout *horizontalLayout_3;
    QLabel *name;
    QPushButton *change;
    QPushButton *remove;
    QHBoxLayout *horizontalLayout;
    QLabel *address;
    QLabel *test_result;
    QHBoxLayout *horizontalLayout_2;
    QLabel *type;
    QLabel *traffic;

    void setupUi(QWidget *ProxyItem)
    {
        if (ProxyItem->objectName().isEmpty())
            ProxyItem->setObjectName(QString::fromUtf8("ProxyItem"));
        ProxyItem->resize(400, 300);
        QSizePolicy sizePolicy(QSizePolicy::Minimum, QSizePolicy::Minimum);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(ProxyItem->sizePolicy().hasHeightForWidth());
        ProxyItem->setSizePolicy(sizePolicy);
        ProxyItem->setWindowTitle(QString::fromUtf8(""));
        verticalLayout_2 = new QVBoxLayout(ProxyItem);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        horizontalLayout_3 = new QHBoxLayout();
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        name = new QLabel(ProxyItem);
        name->setObjectName(QString::fromUtf8("name"));
        QSizePolicy sizePolicy1(QSizePolicy::Minimum, QSizePolicy::Preferred);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(name->sizePolicy().hasHeightForWidth());
        name->setSizePolicy(sizePolicy1);
        name->setText(QString::fromUtf8("\345\220\215\347\247\260"));

        horizontalLayout_3->addWidget(name);

        change = new QPushButton(ProxyItem);
        change->setObjectName(QString::fromUtf8("change"));
        QSizePolicy sizePolicy2(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(change->sizePolicy().hasHeightForWidth());
        change->setSizePolicy(sizePolicy2);
        QIcon icon;
        icon.addFile(QString::fromUtf8(":/icon/material/swap-horizontal.svg"), QSize(), QIcon::Normal, QIcon::Off);
        change->setIcon(icon);

        horizontalLayout_3->addWidget(change);

        remove = new QPushButton(ProxyItem);
        remove->setObjectName(QString::fromUtf8("remove"));
        sizePolicy2.setHeightForWidth(remove->sizePolicy().hasHeightForWidth());
        remove->setSizePolicy(sizePolicy2);
        QIcon icon1;
        icon1.addFile(QString::fromUtf8(":/icon/material/delete.svg"), QSize(), QIcon::Normal, QIcon::Off);
        remove->setIcon(icon1);

        horizontalLayout_3->addWidget(remove);


        verticalLayout_2->addLayout(horizontalLayout_3);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        address = new QLabel(ProxyItem);
        address->setObjectName(QString::fromUtf8("address"));
        QSizePolicy sizePolicy3(QSizePolicy::Maximum, QSizePolicy::Preferred);
        sizePolicy3.setHorizontalStretch(0);
        sizePolicy3.setVerticalStretch(0);
        sizePolicy3.setHeightForWidth(address->sizePolicy().hasHeightForWidth());
        address->setSizePolicy(sizePolicy3);
        address->setStyleSheet(QString::fromUtf8("color: rgb(102, 102, 102);"));
        address->setText(QString::fromUtf8("\345\234\260\345\235\200"));

        horizontalLayout->addWidget(address);

        test_result = new QLabel(ProxyItem);
        test_result->setObjectName(QString::fromUtf8("test_result"));
        sizePolicy1.setHeightForWidth(test_result->sizePolicy().hasHeightForWidth());
        test_result->setSizePolicy(sizePolicy1);
        test_result->setText(QString::fromUtf8("\346\265\213\350\257\225\347\273\223\346\236\234"));
        test_result->setAlignment(Qt::AlignRight|Qt::AlignTrailing|Qt::AlignVCenter);

        horizontalLayout->addWidget(test_result);


        verticalLayout_2->addLayout(horizontalLayout);

        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        type = new QLabel(ProxyItem);
        type->setObjectName(QString::fromUtf8("type"));
        sizePolicy3.setHeightForWidth(type->sizePolicy().hasHeightForWidth());
        type->setSizePolicy(sizePolicy3);
        type->setStyleSheet(QString::fromUtf8("color: rgb(251, 114, 153);"));
        type->setText(QString::fromUtf8("\347\261\273\345\236\213"));

        horizontalLayout_2->addWidget(type);

        traffic = new QLabel(ProxyItem);
        traffic->setObjectName(QString::fromUtf8("traffic"));
        sizePolicy1.setHeightForWidth(traffic->sizePolicy().hasHeightForWidth());
        traffic->setSizePolicy(sizePolicy1);
        traffic->setText(QString::fromUtf8("\346\265\201\351\207\217"));
        traffic->setAlignment(Qt::AlignRight|Qt::AlignTrailing|Qt::AlignVCenter);

        horizontalLayout_2->addWidget(traffic);


        verticalLayout_2->addLayout(horizontalLayout_2);


        retranslateUi(ProxyItem);

        QMetaObject::connectSlotsByName(ProxyItem);
    } // setupUi

    void retranslateUi(QWidget *ProxyItem)
    {
        (void)ProxyItem;
    } // retranslateUi

};

namespace Ui {
    class ProxyItem: public Ui_ProxyItem {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_PROXYITEM_H
