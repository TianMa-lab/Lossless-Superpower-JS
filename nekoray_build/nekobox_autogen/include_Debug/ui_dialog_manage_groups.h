/********************************************************************************
** Form generated from reading UI file 'dialog_manage_groups.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_MANAGE_GROUPS_H
#define UI_DIALOG_MANAGE_GROUPS_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QListWidget>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>

QT_BEGIN_NAMESPACE

class Ui_DialogManageGroups
{
public:
    QVBoxLayout *verticalLayout;
    QListWidget *listWidget;
    QHBoxLayout *horizontalLayout;
    QPushButton *add;
    QPushButton *update_all;

    void setupUi(QDialog *DialogManageGroups)
    {
        if (DialogManageGroups->objectName().isEmpty())
            DialogManageGroups->setObjectName(QString::fromUtf8("DialogManageGroups"));
        DialogManageGroups->resize(640, 480);
        DialogManageGroups->setFocusPolicy(Qt::TabFocus);
        verticalLayout = new QVBoxLayout(DialogManageGroups);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        listWidget = new QListWidget(DialogManageGroups);
        listWidget->setObjectName(QString::fromUtf8("listWidget"));
        listWidget->setFocusPolicy(Qt::NoFocus);

        verticalLayout->addWidget(listWidget);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        add = new QPushButton(DialogManageGroups);
        add->setObjectName(QString::fromUtf8("add"));
        add->setFocusPolicy(Qt::NoFocus);

        horizontalLayout->addWidget(add);

        update_all = new QPushButton(DialogManageGroups);
        update_all->setObjectName(QString::fromUtf8("update_all"));
        update_all->setFocusPolicy(Qt::NoFocus);

        horizontalLayout->addWidget(update_all);


        verticalLayout->addLayout(horizontalLayout);


        retranslateUi(DialogManageGroups);

        QMetaObject::connectSlotsByName(DialogManageGroups);
    } // setupUi

    void retranslateUi(QDialog *DialogManageGroups)
    {
        DialogManageGroups->setWindowTitle(QCoreApplication::translate("DialogManageGroups", "Groups", nullptr));
        add->setText(QCoreApplication::translate("DialogManageGroups", "New group", nullptr));
        update_all->setText(QCoreApplication::translate("DialogManageGroups", "Update all subscriptions", nullptr));
    } // retranslateUi

};

namespace Ui {
    class DialogManageGroups: public Ui_DialogManageGroups {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_MANAGE_GROUPS_H
