def createAccesories():
    from .models import Repuesto
    from random import randint

    accesories_list = ['Motor', 'Cilindro', 'Bateria', 'Puerta', 'Luces']
    sizes = ["L", "M", "S"]
    for currentAccesory in accesories_list:
        for currentSize in sizes:
            for isImported in [True, False]:
                currentRepuesto = Repuesto(
                    nombre=currentAccesory, 
                    precio=randint(21, 2100), 
                    size=currentSize, 
                    importado=isImported
                )
                currentRepuesto.save()
    print('Repuestos creados')

def deleteAccesories():
    from .models import Repuesto
    repuestos = Repuesto.objects.all()
    repuestos.delete()
    print('Repuestos eliminados')

def printAccesories():
    from .models import Repuesto
    repuestos = Repuesto.objects.all()
    for repuesto in repuestos:
        print(
            f"{repuesto.nombre} {repuesto.size} {repuesto.price} {'I' if repuesto.importado else 'N'}"
        )