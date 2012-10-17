
function dcpu_model_B () {

    dcpu = {};

    var skipflag=false;
    
    var regBase=0x10000;
    var regA=regBase+0x00;
    var regB=regBase+0x01;
    var regC=regBase+0x02;
    var regX=regBase+0x03;
    var regY=regBase+0x04;
    var regZ=regBase+0x05;
    var regI=regBase+0x06;
    var regJ=regBase+0x07;
    
    var PC=regBase+0x08;
    var SP=regBase+0x09;
    var EX=regBase+0x0a;
    var IA=regBase+0x0b;

    
    dcpu.ram = new Uint16Array( (regBase + 32) * 2);
    
    var ram = dcpu.ram;
    
    function calculateBReference(bits) {
       var result;
       var reg = bits & 0x7;
       switch (bits & 0x18) {
         case 0x00:  result = regBase+reg;
         break;
         case 0x08:  result = ram[regBase+reg]; 
         break;
         case 0x10:  
                     result = (ram[PC]++ + ram[regBase+reg]) & 0xffff;
         break;
         case 0x18: 
                     switch (bits) {
                        case 0x18:  result = --ram[SP];
                        break;
                        case 0x19:  result = ram[SP];
                        break;
                        case 0x1a:  result = (ram[PC]++ + ram[SP]) & 0xffff;
                        break
                        case 0x1b:
                                    result = SP;
                        break;
                        case 0x1c:
                                    result = PC;
                        break;
                        case 0x1d: 
                                    result = EX;
                        break;
                        case 0x1e:
                                    result = ram[ram[PC]++];
                        break;
                        case 0x1f:
                                    result = ram[PC]++;                                    
                    }
             
        }
        
        return result;
    }
    
    function calculateAValue(bits) {
       if ((bits & 0x20) == 0x20)  {
         return ((bits & 0x1f) - 1) & 0xffff;
       }
       
       var result;
       var reg = bits & 0x7;
       switch (bits & 0x18) {
         case 0x00:  result = regBase+reg;
         break;
         case 0x08:  result = ram[regBase+reg]; 
         break;
         case 0x10:  
                     result = (ram[PC]++ + ram[regBase+reg]) & 0xffff;
         break;
         case 0x18: 
                     switch (bits) {
                        case 0x18:  result = ram[SP]++;
                        break;
                        case 0x19:  result = ram[SP];
                        break;
                        case 0x1a:  result = (ram[PC]++ + ram[SP]) & 0xffff;
                        break
                        case 0x1b:
                                    result = SP;
                        break;
                        case 0x1c:
                                    result = PC;
                        break;
                        case 0x1d: 
                                    result = EX;
                        break;
                        case 0x1e:
                                    result = ram[ram[PC]++];
                        break;
                        case 0x1f:
                                    result = ram[PC]++;                                    
                    }
             
        }
        return ram[result];              
    }
    
    function signExtendWord(value) {
      return (value > 0x10000)?value - 0x10000:value;
    }
    
    function executeInstruction() { 
        var instruction = ram[ram[PC]++];
        var opcode = instruction & 0x1f;
        var bcode = (instruction >>5) & 0x1f;
        var acode = (instruction >>10);
        
        var s="Instruction:"+instruction.toString(16);
        s+="   opcode"+opcode.toString(16);
        s+="   bcode"+bcode.toString(16);
        s+="   acode"+acode.toString(16);
        
        //alert(s);
        
        if (opcode == 0) specialInstruction(instruction)
        else {
            var aValue = calculateAValue(acode);
            var bRef = calculateBReference(bcode);
            var r=0;
            alert("opcode:"+opcode.toString(16)+"\navalue:"+aValue.toString(16)+"\nbref:"+bRef.toString(16));
        
            switch (opcode) {
                case 0x01:  ram[bRef]=aValue;
                break;
                case 0x02:  
                   r= ram[bRef]+aValue;
                   ram[EX]=r>>16;
                   ram[bRef]=r;
                break;
                case 0x03: 
                   r= ram[bRef]-aValue;
                   ram[EX]=r>>16;
                   ram[bRef]=r;
                break;
                case 0x04: 
                   r= ram[bRef]*aValue;
                   ram[EX]=r>>16;
                   ram[bRef]=r;
                break;
                case 0x05: 
                   r= signExtendWord(ram[bRef])*signExtendWord(aValue);
                   ram[EX]=r>>16;
                   ram[bRef]=r;
                break;
                case 0x06: 
                   if (aValue==0) { 
                     ram[EX]=0;
                     ram[bRef]=0;
                   }
                   else
                   {
                     r= ram[bRef]/aValue;
                     ram[EX]=r>>16;
                     ram[bRef]=r;
                   }
                break;
                case 0x07: 
                   if (aValue==0) { 
                     ram[EX]=0;
                     ram[bRef]=0;
                   }
                   else
                   {
                     r= signExtendWord(ram[bRef])/signExtendWord(aValue);
                     ram[EX]=r>>16;
                     ram[bRef]=r;
                   }
                break;
                case 0x08: 
                    if (aValue==0) { 
                         ram[bRef]=0;
                    } else {
                      ram[bRef]%=aValue;
                    }
                break
                case 0x09: 
                    ram[bRef]&=aValue;
                break
                case 0x0A: 
                    ram[bRef]|=aValue;
                break
                case 0x0B: 
                    ram[bRef]^=aValue;
                break
                case 0x0C: 
                    ram[EX]= ((ram[bRef]<<16) >> a) &0xffff;
                    ram[bRef] =ram[bRef]>>a;
                break
                case 0x0D: 
                    ram[EX]= (signExtendWord((ram[bRef])<<16) >> a) &0xffff;
                    ram[bRef] =signExtendWord(ram[bRef])>>a;
                break
                case 0x0E: 
                    ram[EX]= ((ram[bRef]<<a) >> 16) &0xffff;
                    ram[bRef] =ram[bRef]<<a;
                break
                case 0x0F: 
                    //spooky
                    break;
                
                case 0x10:
                    skipFlag =!  ((ram[bref] & aValue) !=0);
                    break;
                case 0x11:
                    skipFlag =! ((ram[bref] & aValue) ==0);
                    break;
                case 0x12:
                    skipFlag =! (ram[bref] == aValue);
                    break;
                case 0x13:
                    skipFlag =! (ram[bref] != aValue);
                    break;
                case 0x14:
                    skipFlag =! (ram[bref] > aValue);
                    break;
                case 0x15:
                    skipFlag =! (signExtendWord(ram[bref]) > signExtendWord(aValue));
                    break;
                case 0x16:
                    skipFlag =! (ram[bref] < aValue);
                    break;
                case 0x17:
                    skipFlag =! (signExtendWord(ram[bref]) < signExtendWord(aValue));
                    break;
            }
        }
    
    }    
    function specialInstruction(instruction) {
            var opcode = (instruction >>5) & 0x1f;
            var acode = (instruction >>10);   
            if (opcode == 0x09) {
               var bRef=calulateBReference(acode & 0x1f);
               ram[bRef]=ram[IA];
            } 
            else
            {
               var aValue = calculateAValue(acode);
               switch  (opcode) {
                 case 0x01:  
                    ram[ram[--SP]]=ram[PC];
                    ram[pc]=aValue;                    
                 break;
                 case 0x0a:  
                    ram[IA],aValue;
               }
            }
            
        }
        
    dcpu.step = function() {
      executeInstruction();
    }
    
    
    dcpu.__defineGetter__("A",function() {return ram[regA];});
    dcpu.__defineGetter__("B",function() {return ram[regB];});
    dcpu.__defineGetter__("C",function() {return ram[regC];});

    dcpu.__defineGetter__("X",function() {return ram[regX];});
    dcpu.__defineGetter__("Y",function() {return ram[regY];});
    dcpu.__defineGetter__("Z",function() {return ram[regZ];});

    dcpu.__defineGetter__("I",function() {return ram[regI];});
    dcpu.__defineGetter__("J",function() {return ram[regJ];});

    dcpu.__defineGetter__("PC",function() {return ram[PC];});
    dcpu.__defineGetter__("SP",function() {return ram[SP];});

    dcpu.__defineGetter__("EX",function() {return ram[EX];});
    dcpu.__defineGetter__("IA",function() {return ram[IA];});

    return dcpu;

    
}