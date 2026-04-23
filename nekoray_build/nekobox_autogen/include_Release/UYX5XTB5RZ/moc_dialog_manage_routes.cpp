/****************************************************************************
** Meta object code from reading C++ file 'dialog_manage_routes.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "D:/opensource/nekoray/ui/dialog_manage_routes.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'dialog_manage_routes.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_DialogManageRoutes_t {
    QByteArrayData data[16];
    char stringdata0[201];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_DialogManageRoutes_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_DialogManageRoutes_t qt_meta_stringdata_DialogManageRoutes = {
    {
QT_MOC_LITERAL(0, 0, 18), // "DialogManageRoutes"
QT_MOC_LITERAL(1, 19, 6), // "accept"
QT_MOC_LITERAL(2, 26, 0), // ""
QT_MOC_LITERAL(3, 27, 17), // "getBuiltInSchemes"
QT_MOC_LITERAL(4, 45, 15), // "QList<QAction*>"
QT_MOC_LITERAL(5, 61, 14), // "schemeToAction"
QT_MOC_LITERAL(6, 76, 8), // "QAction*"
QT_MOC_LITERAL(7, 85, 4), // "name"
QT_MOC_LITERAL(8, 90, 16), // "NekoGui::Routing"
QT_MOC_LITERAL(9, 107, 6), // "scheme"
QT_MOC_LITERAL(10, 114, 20), // "UpdateDisplayRouting"
QT_MOC_LITERAL(11, 135, 17), // "NekoGui::Routing*"
QT_MOC_LITERAL(12, 153, 4), // "conf"
QT_MOC_LITERAL(13, 158, 2), // "qv"
QT_MOC_LITERAL(14, 161, 18), // "SaveDisplayRouting"
QT_MOC_LITERAL(15, 180, 20) // "on_load_save_clicked"

    },
    "DialogManageRoutes\0accept\0\0getBuiltInSchemes\0"
    "QList<QAction*>\0schemeToAction\0QAction*\0"
    "name\0NekoGui::Routing\0scheme\0"
    "UpdateDisplayRouting\0NekoGui::Routing*\0"
    "conf\0qv\0SaveDisplayRouting\0"
    "on_load_save_clicked"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_DialogManageRoutes[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       6,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    0,   44,    2, 0x0a /* Public */,
       3,    0,   45,    2, 0x0a /* Public */,
       5,    2,   46,    2, 0x0a /* Public */,
      10,    2,   51,    2, 0x0a /* Public */,
      14,    1,   56,    2, 0x0a /* Public */,
      15,    0,   59,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void,
    0x80000000 | 4,
    0x80000000 | 6, QMetaType::QString, 0x80000000 | 8,    7,    9,
    QMetaType::Void, 0x80000000 | 11, QMetaType::Bool,   12,   13,
    QMetaType::Void, 0x80000000 | 11,   12,
    QMetaType::Void,

       0        // eod
};

void DialogManageRoutes::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<DialogManageRoutes *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->accept(); break;
        case 1: { QList<QAction*> _r = _t->getBuiltInSchemes();
            if (_a[0]) *reinterpret_cast< QList<QAction*>*>(_a[0]) = std::move(_r); }  break;
        case 2: { QAction* _r = _t->schemeToAction((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const NekoGui::Routing(*)>(_a[2])));
            if (_a[0]) *reinterpret_cast< QAction**>(_a[0]) = std::move(_r); }  break;
        case 3: _t->UpdateDisplayRouting((*reinterpret_cast< NekoGui::Routing*(*)>(_a[1])),(*reinterpret_cast< bool(*)>(_a[2]))); break;
        case 4: _t->SaveDisplayRouting((*reinterpret_cast< NekoGui::Routing*(*)>(_a[1]))); break;
        case 5: _t->on_load_save_clicked(); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject DialogManageRoutes::staticMetaObject = { {
    QMetaObject::SuperData::link<QDialog::staticMetaObject>(),
    qt_meta_stringdata_DialogManageRoutes.data,
    qt_meta_data_DialogManageRoutes,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *DialogManageRoutes::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *DialogManageRoutes::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_DialogManageRoutes.stringdata0))
        return static_cast<void*>(this);
    return QDialog::qt_metacast(_clname);
}

int DialogManageRoutes::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QDialog::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 6)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 6;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 6)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 6;
    }
    return _id;
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
