/********************************************************************************
** Form generated from reading UI file 'edit_chain.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_CHAIN_H
#define UI_EDIT_CHAIN_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QLabel>
#include <QtWidgets/QListWidget>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_EditChain
{
public:
    QVBoxLayout *verticalLayout;
    QLabel *label;
    QListWidget *listWidget;
    QPushButton *select_profile;

    void setupUi(QWidget *EditChain)
    {
        if (EditChain->objectName().isEmpty())
            EditChain->setObjectName(QString::fromUtf8("EditChain"));
        EditChain->resize(400, 400);
        EditChain->setWindowTitle(QString::fromUtf8("EditChain"));
        verticalLayout = new QVBoxLayout(EditChain);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        label = new QLabel(EditChain);
        label->setObjectName(QString::fromUtf8("label"));

        verticalLayout->addWidget(label);

        listWidget = new QListWidget(EditChain);
        listWidget->setObjectName(QString::fromUtf8("listWidget"));
        listWidget->setMinimumSize(QSize(0, 300));
        listWidget->setContextMenuPolicy(Qt::ActionsContextMenu);
        listWidget->setDragDropMode(QAbstractItemView::InternalMove);
        listWidget->setDefaultDropAction(Qt::MoveAction);
        listWidget->setMovement(QListView::Free);

        verticalLayout->addWidget(listWidget);

        select_profile = new QPushButton(EditChain);
        select_profile->setObjectName(QString::fromUtf8("select_profile"));

        verticalLayout->addWidget(select_profile);


        retranslateUi(EditChain);

        QMetaObject::connectSlotsByName(EditChain);
    } // setupUi

    void retranslateUi(QWidget *EditChain)
    {
        label->setText(QCoreApplication::translate("EditChain", "Traffic order is from top to bottom", nullptr));
        select_profile->setText(QCoreApplication::translate("EditChain", "Select Profile", nullptr));
        (void)EditChain;
    } // retranslateUi

};

namespace Ui {
    class EditChain: public Ui_EditChain {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_CHAIN_H
