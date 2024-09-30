# Backend 

## Como correr el programa

1. Crear un entorno virtual 
2. Dentro del proyecto y el entorno creado 
        
        pip install -r requirements.txt

3. Cambiar el ENVIROMENT usado para la bd

        export ENVIROMENT=development

4. Levantar la app 

        uvicorn app:app --reload

5. Si se quiere ejecutar algun pedido ingresar en http://127.0.0.1:8000 


## Como correr los tests 

Si por alguna razon ya sea, no estaba en el entorno virtual o alguna otra razon los test fallan, borrar la base de datos llamada database_test.sqlite y correr de nuevo, sino afecta a los demas tests

1. Crear un entorno virtual si es que no se creo antes  
2. Dentro del proyecto y el entorno creado 
        
        pip install -r requirements.txt

3. Para los tests unitarios correr 

        make run_unit_tests

4. Para los test de integracion correr 

        make run_integration_tests

5. Para correr los test end to end prender la aplicacion en otra consola y correr 

        make run_end2end_tests




