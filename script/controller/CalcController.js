class CalcController { 
  constructor(){

    this._audio = new Audio('click.mp3'); //new Audio nao é nativo do JS é uma API que o JS ja entende como parte 
    this._audioOnOff = false;
    this._lastOperator= ''; //atributos para guardar o ultimo operador 
    this._lastNumber = ''; //e o ultimo numero, para usar no metodo do clicar no igual duas vezes

    this._operation = [];
    this._locale= 'pt-BR';
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl= document.querySelector("#data");
    this._timeEl= document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();
}

    pastFromClipboar(){ //metodo para colar dados de outros lugares
       
        document.addEventListener('paste', e=> { //o evento ve se algo foi colado
                //e esta controlando as informaçoes 
            let text = e.clipboardData.getData('Text');// dentro do e (arrowfuncion) tem a propriedade clip e nela tem io metodo getData q recebe o tipo de informação q vai receber

            this.displayCalc = parseFloat(text); //valida como um numero oq foi passado para o text

            console.log(text);
        })
    
    }

    copyToClipboard(){ //metodo que sera usado para o cópia e cola, usa o svg para botar um input com o resultado onde pode copiar a conta
       
        let input = document.createElement('input'); //cria o elemento na tela dinamicamente
       
        input.value = this.displayCalc; //diz qual o valor do input (o resultado do display)
    
        document.body.appendChild(input); //coloca o input na tela 

        input.select(); //agora eu posso selecionar ele
        
        document.execCommand("Copy"); //o SO pode copiar oq foi selecionado
    
        input.remove();
    }


    initialize(){
        
        this.setDisplayDateTime();
        
        setInterval(()=>{
            this.setDisplayDateTime();
           
        }, 1000);

        this.setLastNumberToDisplay();
        this.pastFromClipboar();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            
            btn.addEventListener('dblclick', e=>{
               
                this.toggleAudio();

            });


        });
    }

    toggleAudio(){ //interrupitor do audio

        this._audioOnOff = !this._audioOnOff; //esse cara é ao contrário desse cara
       //se for false vai virar true se for true vai virar false
       //tbm pode ser usado o if ternario this._audioOnOff = (this._audioOnOff) ? false : true;
    
    }

    playAudio(){

       if (this._audioOnOff) {

            this._audio.currentTime = 0; //  currentTime = o tempo que o aúdio ta volta para o inicio (que é o 0seg), toda vez que tocar vai para o inicio
            this._audio.play();           

        }

    }


    initKeyboard(){ //vai procurar os evetos no teclado com o addEventListener
    
        document.addEventListener('keyup', e =>{ //keyup é o evento de largar a tecla do pc, entao quando largar a tecla o evento vai acontecer
           
            this.playAudio();
            

            switch (e.key) { //e é a funçao que vai acontecer dentro do metodo 
                /* o metodo vai procurar no console a informaçao do 'key' que é acionada quando 
                é clicado algo no teclado e ele guarda o que foi. Ao clicar em alguma tecla entra 
                no switch e faz as contas pelo teclado  */ 
                
                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
    
                case 'Enter':
                    this.calc();
                break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':             
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
                
        });

    }
    
  


    addEventListenerAll(element, events, fn  ){
        events.split(' ').forEach(event  =>{ //o split ta transformando em array os parametros "click drag", para poder usar os dois eventos em um metodos, com a separaçao por espaço
            element.addEventListener(event, fn, false);
        
        });
    
    }
    
    clearAll(){
    
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();//retorna nada 

    }

    
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();//retorna o ultimo numero antes do ce

    
    }

    setError(){
        this.displayCalc = "Error";
    }

    getLastOperation(){
        
        return this._operation[this._operation.length-1]; //retorna o ultimo valor do array operation
    
    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value; //se o ultimo elemento do array operation for um sinal e o proximo outro sinal, ele substituira o anterior
    
    }
    
    isOperator(value){ //metodo para verificar se oq esta em ultimo no this._operation é um sinal
    
        return (['+', '-','/', '*', '%'].indexOf(value) > -1); //indexOf verifica se ha ali dentro do array e retorna true ou false
    
    }
    pushOperation(value){ //metodo que envia o operador para dentro do array
        this._operation.push(value); 

        if (this._operation.length > 3) { //se tiver mais de 3 itens no array ele executa o calc()
            this.calc();
            
            
            
        
        }
    }

    getResult(){ //eval valida as informaçoes do array (interpreta como conta as strings) e transforma com o join(junta as informaçoes do array) em uma conta valida 
       
        try{ //ele vai tentar validar as informações do array, se ele nao conseguir...
            return eval(this._operation.join(""));

        } catch(e){ //... Ele vai passar para esse erro 
            setTimeout(()=>{
                this.setError();

            }, 1);

        }

    }

    calc(){
        let last = ''; 
        
        this._lastOperator= this.getLastItem(); //esta guardando ultimmo operador(pq por padrao isOperator  é true) 


        if(this._operation.length < 3){ //se for menor q 3 faça
        
            let firstItem = this._operation[0]; 
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
            
        }

        if (this._operation.length > 3) { //so tira o ultimo se for maior q 3 itens
            last = this._operation.pop();

            this._lastNumber = this.getResult(); //guardar o resultado da conta para o botao igual 
    
        } else if (this._operation.length == 3) { //quando o codigo usar o pop, e ficar com 3 itens de novo
            //ele nao vai ficar no lastNumber, vai sair da decisão
        
             this._lastNumber = this.getLastItem(false); //guardar o ultimo numero (passando o padrao false para o iOperator) da conta para o botao igual 
    

        }
        
      
        let result = this.getResult(); 
        
        if (last == "%"){ //se for o  sinal % vc faz essa conta
            
            result/= 100; //calculo do porcento
            this._operation = [result];

        } else { //se nao segue com isso 
            
            this._operation = [result]; //operation vira o array result, last. result resultado e o last ultima coisa q digitou
            
            if (last) this._operation.push(last); //se tiver algo no last bota no array
        }
        
        this.setLastNumberToDisplay(); //entao mostra esse resultado no display
    
    }

    getLastItem(isOperator = true){ //por padrão o parametro e true, deve me retornar que é true, é um operador
            let lastItem;
        
            for (let i = this._operation.length - 1; i >= 0; i--) {//começando no total de itens  do array (- 1 pois eu vou 
        //precisar da posiçao no array, e so tem 0 1 2 posiçoes para retornar) 
        //acabe quando chegar no 0 e passe de forma descrecente pelo array
                                             
                if (this.isOperator(this._operation[i]) == isOperator ) { //se for igual ao parametro isOperator(se for mesmo um operador) faça
                    lastItem = this._operation[i]; // entra na var e manda esse numero para o array
                    break;
                }
                    
            }
            
            if (!lastItem){ //procura o ultimo operador para ele continuar somando quando clicar no igual e nao concatenar
            
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
                //se operador = true,  fica com ele, se nao fica com o ultimo numero 
            }
            return lastItem;
    }
        


    setLastNumberToDisplay(){ //manda a ultima coisa digitada para o display
        
        let lastNumber = this.getLastItem(false) // var é igual ao ultimo numero, pois se for verdade o getLast, ele é um operador, nao um numero
        
        if (!lastNumber) lastNumber = 0; //se isso é vazio, bota 0
        
        this.displayCalc = lastNumber; //botando o numero no display
    
    }
    addOperation(value){
        
            if (isNaN(this.getLastOperation())) { //se nao for um numero faça
                
                if (this.isOperator(value)){ // é executado se o valor passado para a função addOperation() for um operador (+, -, /, *, %). A função isOperator() é usada para verificar se o valor é um desses operadores.
                                            // "é um operador?"
                    this.setLastOperation(value); // se for um operador então atualizamos o ultimo elemento do array _operation com esse operador usando a função 
        
            
                } else { // se nao e um operator nem outra coisa ele e um numero que passamos para o array 
                         //"é um numero"
                    this.pushOperation(value);
                    this.setLastNumberToDisplay(); //"entao mostra esse numero no display"

                }
                
            
            } else {
                if (this.isOperator(value)){ //verifica novamente se é um operador pois no if acima ele trata de "ok, um operador, opa veio outro, entao eu vou trocar" 
                    
                    this.pushOperation(value);// esse trata do operador unico, outro caso, oq vai fazer dps de ser so um operador? vai adicionar no array 

                } else {
                    let newValue = this.getLastOperation().toString() + value.toString();  // se for um numero pega os dois, transforma em string e concatena os dois com um número só 
                    this.setLastOperation(newValue); //convermos para numero de novo e botamos novamente no array
                    
                    this.setLastNumberToDisplay();
                }
            }

    
    }

    addDot(){ //usando o ponto na conta 
    
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        //verifica se na var tem lastOperation tem uma string (o ponto) e se tiver dentro procura e se tiver mais de 1, sai e retorna para o resto do codigo

        if (this.isOperator(lastOperation) || !lastOperation){
        //se é um operador no isOperator OU se nao tem um operador anterior
            this.pushOperation('0.'); //significa que um novo numero deve ser iniciado com o ponto decimal

        } else { //se nao é um operador e nao é vazio
        
            this.setLastOperation(lastOperation.toString() + '.');
            //transformando em string e junta o ponto com o numero 
        }
        this.setLastNumberToDisplay();//atualizando o display
    }
    
    execBtn(value){ //metodo de botão pressionado

        this.playAudio();

        
        switch (value) {
            case 'ac':
                this.clearAll();
            break;

            case 'ce':
                this.clearEntry();
            break;

            case 'soma':
                this.addOperation('+');
            break;

            case 'subtracao':
                this.addOperation('-');
            break;
            
            case 'divisao':
                this.addOperation('/');
            break; 
            
            case 'multiplicacao':
                this.addOperation('*');
            break;

            case 'porcento':
                this.addOperation('%');
            break;

            case 'igual':
                this.calc();
            break;

            case 'ponto':
                this.addDot();

            break;

            case '0':
            case '1':
            case '2':
            case '3':             
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
            this.setError();
            break
        }
            
    }
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g"); //seleciona a classe buttons/parts e seus filhos
    
        buttons.forEach((btn,index) => {
            this.addEventListenerAll(btn, "click drag", e => { //passando os parametros da funçao
                
                let textBtn = btn.className.baseVal.replace("btn-", "");  /*btn.className.baseVal retorna só o nome da classe do btn que esta dentro de uma tag <svg> (que é o formato de arquivo baseado em XML)
                replace esta tirando o bnt do console*/
                
                this.execBtn(textBtn); //recendo o valor do botao direto da classe
            }); 

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer" //quando o mouse passar por cima vai ficar com o dedinho de clicar 
           
            });
        });
    }

    setDisplayDateTime(){ //esta selecionando ao mesmo tempo o displayDate e o displayTime
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month:"long",
            year:"numeric"
        
        });
        
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
   
    get displayCalc(){
        return this._displayCalcEl.innerHTML; //amarrando o elemento HTML na propriedade displayCalc, para retornar ela la na calculadora 
    }
    set displayCalc(value){

        
        if (value.toString().length>10){ // se passar de 10 numeros vai ter erro na tela pq explode o layout da calc
                //toString para ele tbm dar isso com o resultado de contas grandes
            this.setError();
            return false;

        }

        this._displayCalcEl.innerHTML = value;
    }
    
    get displayDate(){ 
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    } 
   
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }
}