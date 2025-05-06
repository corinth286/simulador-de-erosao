let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let carros = [];
let prediosAtraz = [];

function setup() {
  createCanvas(600, 400).parent("canvas-holder");
  solo = new Solo(tipoSolo);
  // Inicializa alguns carros na área urbanizada, mais para baixo
  for (let i = 0; i < 5; i++) {
    carros.push(new Carro(random(width), solo.altura - 5)); // Ajustei a posição Y dos carros
  }
}

function draw() {
  background(200, 220, 255); // céu

  // Simulação da chuva
  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();
    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  // Desenha os elementos do solo dependendo do tipo
  if (tipoSolo === "urbanizado") {
    // Desenha os prédios de trás primeiro
    for (let predio of prediosAtraz) {
      predio.mostrar();
    }
    // Desenha o solo urbanizado
    solo.mostrar();
    // Desenha e move os carros
    for (let carro of carros) {
      carro.mover();
      carro.mostrar();
    }
  } else {
    // Desenha o solo para outros tipos (vegetação, exposto)
    solo.mostrar();
  }

  // Cria novas gotas de chuva periodicamente
  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  carros = []; // Limpa os carros ao mudar para outro tipo de solo
  prediosAtraz = []; // Limpa os prédios de trás
  if (tipoSolo === "urbanizado") {
    // Reinicializa os carros ao mudar para a área urbanizada
    for (let i = 0; i < 5; i++) {
      carros.push(new Carro(random(width), solo.altura - 5)); // Ajustei a posição Y dos carros
    }
    // Gera os prédios de trás
    gerarPrediosDeAtraz();
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Carro {
  constructor(x, y) {
    this.x = x;
    this.y = y; // Os carros agora são criados nesta posição Y
    this.vel = random(1, 3);
    this.largura = random(15, 30);
    this.altura = this.largura * 0.4;
    this.cor = color(random(255), random(255), random(255));
  }

  mover() {
    this.x += this.vel;
    if (this.x > width + this.largura) {
      this.x = -this.largura;
    }
  }

  mostrar() {
    fill(this.cor);
    rect(this.x, this.y, this.largura, this.altura, 5); // Corpo do carro com bordas arredondadas
    fill(0); // Rodas pretas
    ellipse(this.x + this.largura * 0.2, this.y + this.altura * 0.8, this.altura * 0.6);
    ellipse(this.x + this.largura * 0.8, this.y + this.altura * 0.8, this.altura * 0.6);
  }
}

class Predio {
  constructor(x, y, largura, altura, cor) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
  }

  mostrar() {
    fill(this.cor);
    rect(this.x, this.y, this.largura, this.altura);
    this.desenharJanelas(this.x, this.y, this.largura, this.altura);
  }

  desenharJanelas(xPredio, yPredio, larguraPredio, alturaPredio) {
    let larguraJanela = 5;
    let alturaJanela = 8;
    let espacamentoX = 10;
    let espacamentoY = 15;
    fill(80); // Cor sólida para as janelas
    for (let x = xPredio + espacamentoX; x < xPredio + larguraPredio - espacamentoX; x += larguraJanela + espacamentoX) {
      for (let y = yPredio + espacamentoY; y < yPredio + alturaPredio - espacamentoY; y += alturaJanela + espacamentoY) {
        rect(x, y, larguraJanela, alturaJanela);
      }
    }
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 10; // Ajustei a altura do solo para os prédios ficarem mais baixos
    this.erosao = 0;
    this.vegetacao = []; // Para o tipo vegetação
    this.predios = []; // Para os prédios da frente no tipo urbanizado
    if (this.tipo === "vegetacao") {
      this.gerarVegetacao();
    } else if (this.tipo === "urbanizado") {
      this.gerarPredios();
    }
  }

  gerarVegetacao() {
    let numArvores = 30;
    for (let i = 0; i < numArvores; i++) {
      let x = map(i, 0, numArvores - 1, 20, width - 20);
      let yTronco = this.altura - random(10, 40);
      let alturaTronco = random(30, 70);
      let larguraTronco = random(5, 12);
      let corTronco = color(101, 67, 33);
      let raioCopaX = random(15, 25);
      let raioCopaY = random(12, 20);
      let yCopa = yTronco - raioCopaY;
      let corCopa = color(34, 139, 34);
      this.vegetacao.push({
        tipo: "arvore",
        x: x,
        yTronco: yTronco,
        alturaTronco: alturaTronco,
        larguraTronco: larguraTronco,
        corTronco: corTronco,
        yCopa: yCopa,
        raioCopaX: raioCopaX,
        raioCopaY: raioCopaY,
        corCopa: corCopa
      });
    }
    let numFlores = 20;
    for (let i = 0; i < numFlores; i++) {
      let x = random(20, width - 20);
      let y = this.altura - random(2, 10);
      this.vegetacao.push({ tipo: "flor", x: x, y: y, cor: color(random(255), random(255), random(255)), tamanho: random(3, 8) });
    }
  }

  gerarPredios() {
    let numPredios = 20; // Ajustei o número de prédios da frente
    for (let i = 0; i < numPredios; i++) {
      let largura = random(20, 60);
      let altura = random(60, 150); // Prédios da frente um pouco mais altos
      let x = random(0, width - largura);
      let y = this.altura - altura; // Os prédios agora terminam na nova altura do solo
      let cor = color(random(100, 200)); // Tons de cinza para prédios
      this.predios.push(new Predio(x, y, largura, altura, cor));
    }
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.08;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.1; // Erosão ainda mais lenta

    this.erosao += taxa;
    this.altura += taxa;

    if (this.tipo === "vegetacao") {
      for (let item of this.vegetacao) {
        if (item.tipo === "arvore") {
          item.yTronco += taxa;
          item.yCopa += taxa;
        } else if (item.tipo === "flor") {
          item.y += taxa;
        }
      }
    } else if (this.tipo === "urbanizado") {
      for (let predio of this.predios) {
        predio.y += taxa; // Fazer os prédios subirem com a erosão
      }
      for (let predio of prediosAtraz) {
        predio.y += taxa;
      }
    }
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") {
      fill(60, 150, 60);
      rect(0, this.altura, width, height - this.altura);
      for (let item of this.vegetacao) {
        if (item.tipo === "arvore") {
          fill(item.corTronco);
          rect(item.x - item.larguraTronco / 2, item.yTronco, item.larguraTronco, item.alturaTronco);
          fill(item.corCopa);
          ellipse(item.x, item.yCopa, item.raioCopaX * 2, item.raioCopaY * 2);
        } else if (item.tipo === "flor") {
          fill(item.cor);
          ellipse(item.x, item.y, item.tamanho);
        }
      }
    } else if (this.tipo === "exposto") {
      fill(139, 69, 19);
      rect(0, this.altura, width, height - this.altura);
    } else if (this.tipo === "urbanizado") {
      fill(120);
      rect(0, this.altura, width, height - this.altura);
      for (let predio of this.predios) {
        predio.mostrar();
      }
    }

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

function gerarPrediosDeAtraz() {
  let numPrediosAtraz = 15;
  for (let i = 0; i < numPrediosAtraz; i++) {
    let largura = random(30, 70);
    let altura = random(150, 250); // Prédios de trás mais altos
    let x = random(0, width - largura);
    let y = solo.altura - altura - random(2, 8); // Posiciona mais atrás e mais alto
    let cor = color(random(80, 150)); // Tons de cinza mais escuros para ficarem mais distantes
    prediosAtraz.push(new Predio(x, y, largura, altura, cor));
  }
  // Ordena os prédios de trás por sua posição Y
}
