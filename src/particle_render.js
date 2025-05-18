// particleRenderer.js
export class ParticleRenderer {
    constructor(styleConfig) {
        // styleConfig puede contener: color, gradiente, glow, border, etc.
        // Ejemplo de config:
        // { color: "#FF0000", glow: true, gradiente: true, border: { color: "#fff", width: 2 } }
        this.style = styleConfig || {};
    }


    // partícula esfera
    // draw(ctx, particle) {
    //     ctx.save();

    //     // --- Ejemplo de estilo simple o avanzado:
    //     // Si glow
    //     if (this.style.glow) {
    //         const c = particle.color || this.style.color || '#fff';
    //         ctx.shadowColor = c;
    //         ctx.fillStyle   = c;
    //         ctx.shadowBlur = this.style.glowStrength || 16;
    //     }

    //     // Si gradiente
    //     if (this.style.gradiente) {
    //         const grad = ctx.createRadialGradient(
    //             particle.x, particle.y, 0,
    //             particle.x, particle.y, particle.size
    //         );
    //         grad.addColorStop(0, this.style.color || "#fff");
    //         grad.addColorStop(1, this.style.gradienteTo || "rgba(0,0,0,0)");
    //         ctx.fillStyle = grad;
    //     } else {
    //         ctx.fillStyle = this.style.color || "#fff";
    //     }

    //     ctx.beginPath();
    //     ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    //     ctx.fill();

    //     // Si border
    //     if (this.style.border) {
    //         ctx.lineWidth = this.style.border.width || 1;
    //         ctx.strokeStyle = this.style.border.color || "#fff";
    //         ctx.stroke();
    //     }

    //     ctx.restore();
    // }



    // // partícula como tetraedro
    // draw(ctx, particle) {
    //     ctx.save();
    
    //     // Parámetros del tetraedro
    //     const subCount = 4;
    //     const tetraRadius = particle.size * 1.5;
    //     const time = performance.now() / 900; // Para rotar sutilmente
    
    //     // Coordenadas de un tetraedro regular centrado en el origen (en 3D)
    //     // (los puedes encontrar en Wikipedia; aquí están escalados)
    //     const tetra3D = [
    //         [1,  1,  1],
    //         [1, -1, -1],
    //         [-1, 1, -1],
    //         [-1, -1, 1]
    //     ].map(([x, y, z]) => {
    //         // Rotar el tetraedro sobre el eje Y para animarlo
    //         const angle = time;
    //         const xr = x * Math.cos(angle) + z * Math.sin(angle);
    //         const zr = -x * Math.sin(angle) + z * Math.cos(angle);
    //         return [xr, y, zr];
    //     });
    
    //     // Proyección simple 3D → 2D (ortográfica, puedes usar perspectiva si quieres)
    //     // El "z" lo usamos para escalar levemente el tamaño, simulando profundidad
    //     for (let i = 0; i < subCount; ++i) {
    //         const [x3, y3, z3] = tetra3D[i];
    //         // Centro de la partícula + desplazamiento
    //         const projX = particle.x + x3 * tetraRadius;
    //         const projY = particle.y + y3 * tetraRadius;
    //         const subSize = particle.size * (0.75 + 0.3 * (z3 / Math.sqrt(3))); // cambia el tamaño según "profundidad"
    
    //         ctx.save();
    
    //         // Colores/estilos normales:
    //         if (this.style.glow) {
    //             const c = particle.color || this.style.color || '#fff';
    //             ctx.shadowColor = c;
    //             ctx.fillStyle   = c;
    //             ctx.shadowBlur = this.style.glowStrength || 16;
    //         }
    
    //         if (this.style.gradiente) {
    //             const grad = ctx.createRadialGradient(
    //                 projX, projY, 0,
    //                 projX, projY, subSize
    //             );
    //             grad.addColorStop(0, this.style.color || "#fff");
    //             grad.addColorStop(1, this.style.gradienteTo || "rgba(0,0,0,0)");
    //             ctx.fillStyle = grad;
    //         } else {
    //             ctx.fillStyle = particle.color || this.style.color || "#fff";
    //         }
    
    //         ctx.beginPath();
    //         ctx.arc(projX, projY, subSize, 0, Math.PI * 2);
    //         ctx.fill();
    
    //         if (this.style.border) {
    //             ctx.lineWidth = this.style.border.width || 1;
    //             ctx.strokeStyle = this.style.border.color || "#fff";
    //             ctx.stroke();
    //         }
    
    //         ctx.restore();
    //     }
    
    //     ctx.restore();
    // }


    // partícula como icosaedro
    draw(ctx, particle) {
        ctx.save();
    
        const PHI = (1 + Math.sqrt(5)) / 2;
        const icoVerts = [
          [-1,  PHI,  0], [ 1,  PHI,  0], [-1, -PHI,  0], [ 1, -PHI,  0],
          [ 0, -1,  PHI], [ 0,  1,  PHI], [ 0, -1, -PHI], [ 0,  1, -PHI],
          [ PHI,  0, -1], [ PHI,  0,  1], [-PHI,  0, -1], [-PHI,  0,  1]
        ];
        for (const v of icoVerts) {
          const len = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
          v[0] /= len; v[1] /= len; v[2] /= len;
        }
    
        const icoRadius = particle.size * 1.8;
        const time = performance.now() / 1000;
    
        for (let i = 0; i < icoVerts.length; ++i) {
            let [x3, y3, z3] = icoVerts[i];
            // Rotación animada sobre dos ejes
            let a = time * 0.8;
            let b = time * 0.6;
            // Rotar Y
            let xr = x3 * Math.cos(a) + z3 * Math.sin(a);
            let zr = -x3 * Math.sin(a) + z3 * Math.cos(a);
            // Rotar X
            let yr = y3 * Math.cos(b) - zr * Math.sin(b);
            zr = y3 * Math.sin(b) + zr * Math.cos(b);
    
            // Proyección ortográfica a 2D
            const projX = particle.x + xr * icoRadius;
            const projY = particle.y + yr * icoRadius;
            const subSize = particle.size * (0.7 + 0.28 * (zr));
    
            ctx.save();
            // Glow, gradiente, etc. (igual que antes)
            if (this.style.glow) {
                const c = particle.color || this.style.color || '#fff';
                ctx.shadowColor = c;
                ctx.fillStyle   = c;
                //ctx.shadowBlur = this.style.glowStrength || 16;
            }
    
            if (this.style.gradiente) {
                const grad = ctx.createRadialGradient(
                    projX, projY, 0,
                    projX, projY, subSize
                );
                grad.addColorStop(0, this.style.color || "#fff");
                grad.addColorStop(1, this.style.gradienteTo || "rgba(0,0,0,0)");
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = particle.color || this.style.color || "#fff";
            }
    
            ctx.beginPath();
            ctx.arc(projX, projY, subSize, 0, Math.PI * 2);
            ctx.fill();
    
            if (this.style.border) {
                ctx.lineWidth = this.style.border.width || 1;
                ctx.strokeStyle = this.style.border.color || "#fff";
                ctx.stroke();
            }
            ctx.restore();
        }
    
        ctx.restore();
    }
    
    
}
