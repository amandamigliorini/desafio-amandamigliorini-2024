class RecintosZoo {
    getRecintos() {
        let recintosExistentes = [
            {
                numero: 1,
                bioma: ["savana"],
                tamanhoTotal: 10,
                animaisExistentes: [
                    { especie: "MACACO", quantidade: 3 }
                ]
            },
            {
                numero: 2,
                bioma: ["floresta"],
                tamanhoTotal: 5,
                animaisExistentes: []
            },
            {
                numero: 3,
                bioma: ["savana", "rio"],
                tamanhoTotal: 7,
                animaisExistentes: [
                    { especie: "GAZELA", quantidade: 1 }
                ]
            },
            {
                numero: 4,
                bioma: ["rio"],
                tamanhoTotal: 8,
                animaisExistentes: []
            },
            {
                numero: 5,
                bioma: ["savana"],
                tamanhoTotal: 9,
                animaisExistentes: [
                    { especie: "LEAO", quantidade: 1 }
                ]
            }
        ];
        return recintosExistentes;
    }

    getAnimaisExistentes() {
        let animaisExistentes = [
            { especie: "LEAO", tamanho: 3, bioma: ["savana"], carnivoro: true },
            { especie: "LEOPARDO", tamanho: 2, bioma: ["savana"], carnivoro: true },
            { especie: "CROCODILO", tamanho: 3, bioma: ["rio"], carnivoro: true },
            { especie: "MACACO", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            { especie: "GAZELA", tamanho: 2, bioma: ["savana"], carnivoro: false },
            { especie: "HIPOPOTAMO", tamanho: 4, bioma: ["savana", "rio"], carnivoro: true }
        ];
        return animaisExistentes;
    }

    analisaRecintos(animal, quantidade) {
        let recintos = this.getRecintos();
        let animaisExistentes = this.getAnimaisExistentes();

        let animalEscolhido = animaisExistentes.find(anm => anm.especie === animal.toUpperCase());

        if (!animalEscolhido) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        let recintosViaveis = recintos.filter(recinto => {
            let biomaCorreto = animalEscolhido.bioma.some(b => recinto.bioma.includes(b));
            let espacoOcupado = 0;
            let carnivoroPresente = false;
            let especiesDiferentes = 0;
            let especieExistente;

            if (recinto.animaisExistentes && recinto.animaisExistentes.length > 0) {
                recinto.animaisExistentes.forEach(animalExistente => {
                    especieExistente = animaisExistentes.find(anm => anm.especie === animalExistente.especie);

                    if (especieExistente) {
                        espacoOcupado += especieExistente.tamanho * animalExistente.quantidade;

                        if (especieExistente.carnivoro && especieExistente.especie !== animalEscolhido.especie) {
                            carnivoroPresente = true;
                        }

                        if (especieExistente.especie !== animalEscolhido.especie) {
                            especiesDiferentes++;
                        }
                    }
                });
            }

            if (!biomaCorreto) return false;

            let espacoNecessario = animalEscolhido.tamanho * quantidade;
            if (especiesDiferentes > 0) espacoNecessario += 1;

            if (espacoOcupado + espacoNecessario > recinto.tamanhoTotal) return false;

            if (carnivoroPresente && animalEscolhido.especie !== especieExistente.especie) return false;

            if (animalEscolhido.carnivoro && especieExistente && animalEscolhido.especie !== especieExistente.especie) return false;

            if (animalEscolhido.especie === "HIPOPOTAMO" && (!recinto.bioma.includes("savana") || !recinto.bioma.includes("rio"))) {
                return false;
            }

            if (animalEscolhido.especie === "MACACO" && recinto.animaisExistentes.length === 0 && quantidade === 1) {
                return false;
            }

            return true;
        }).map(recinto => {
            let espacoOcupado = 0;
            if (recinto.animaisExistentes && recinto.animaisExistentes.length > 0) {
                recinto.animaisExistentes.forEach(animalExistente => {
                    let especieExistente = animaisExistentes.find(anm => anm.especie === animalExistente.especie);
                    espacoOcupado += especieExistente ? especieExistente.tamanho * animalExistente.quantidade : 0;
                });
            }

            if (recinto.animaisExistentes && recinto.animaisExistentes.length > 0) {

                recinto.animaisExistentes.forEach(animalExistente => {
                    if (animalExistente.especie !== animal) {
                        espacoOcupado += 1; // espaço extra para convivência entre espécies diferentes
                    }
                });

            }

            let espacoLivre = recinto.tamanhoTotal - espacoOcupado - (animalEscolhido.tamanho * quantidade);

            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });

        if (recintosViaveis.length > 0) {
            return { erro: null, recintosViaveis: recintosViaveis };
        } else {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    }
}

export { RecintosZoo as RecintosZoo };
const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
console.log(resultado);