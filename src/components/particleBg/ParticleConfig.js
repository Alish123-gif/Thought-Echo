export const options = (theme) => ({
    // General settings
    autoPlay: true,
    background: {
        color: {
            value: theme === "dark" ? "#000000" : "rgb(233, 233, 233)" // Background color based on theme
        },
        image: "",
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover",
        opacity: 1
    },
    backgroundMask: {
        composite: "destination-out",
        cover: {
            color: {
                value: theme === "dark" ? "#fff" : "#000" // Mask color based on theme
            },
            opacity: 1
        },
        enable: false
    },
    clear: true,
    defaultThemes: {},
    delay: 0,
    fullScreen: {
        enable: true,
        zIndex: 0
    },
    detectRetina: true,
    duration: 0,
    fpsLimit: 120,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    responsive: [],
    smooth: false,
    style: {},
    themes: [],
    zLayers: 100,
    name: "Connect",
    motion: {
        disable: false,
        reduce: {
            factor: 4,
            value: true
        }
    },

    // Interactivity settings
    interactivity: {
        detectsOn: "window",
        events: {
            onClick: {
                enable: true,
                mode: "push",
                parallax: {
                    enable: true,
                    force: 2,
                    smooth: 10
                }
            },
            onHover: {
                enable: true,
                mode: "connect"
            }
        },
        modes: {
            trail: {
                delay: 1,
                pauseOnStop: false,
                quantity: 1
            },
            attract: {
                distance: 200,
                duration: 0.4,
                easing: "ease-out-quad",
                factor: 1,
                maxSpeed: 4,
                speed: 1
            },
            bounce: {
                distance: 200
            },
            bubble: {
                distance: 400,
                duration: 2,
                mix: false,
                opacity: 0.8,
                size: 40,
                divs: {
                    distance: 200,
                    duration: 0.4,
                    mix: false,
                    selectors: {}
                }
            },
            connect: {
                distance: 40,
                links: {
                    opacity: 0.5
                },
                radius: 60
            },
            grab: {
                distance: 400,
                links: {
                    blink: false,
                    consent: false,
                    opacity: 1
                }
            },
            push: {
                default: true,
                groups: [],
                quantity: 1
            },
            remove: {
                quantity: 2
            },
            slow: {
                factor: 3,
                radius: 200
            },
            light: {
                area: {
                    gradient: {
                        start: {
                            value: "#ffffff"
                        },
                        stop: {
                            value: "#000000"
                        }
                    },
                    radius: 1000
                },
                shadow: {
                    color: {
                        value: "#000000"
                    },
                    length: 2000
                }
            }
        }
    },

    // Particle settings
    particles: {
        number: {
            density: {
                enable: true,
                width: 1920,
                height: 1080
            },
            limit: {
                mode: "delete",
                value: 500
            },
            value: 20 // Lower the particle count
        },
        size: {
            value: {
                min: 20,
                max: 50 // Increase the size range
            },
            animation: {
                count: 0,
                enable: false,
                speed: 5,
                decay: 0,
                delay: 0,
                sync: false,
                mode: "auto",
                startValue: "random",
                destroy: "none"
            }
        },
        opacity: {
            value: 0.3, // Lower the opacity
            animation: {
                count: 0,
                enable: false,
                speed: 2,
                decay: 0,
                delay: 0,
                sync: false,
                mode: "auto",
                startValue: "random",
                destroy: "none"
            }
        },
        links: { // Enable and configure links between particles
            blink: false,
            color: {
                value: theme === "dark" ? "#ffffff" : "#000000" // Link color based on theme
            },
            consent: false,
            distance: 150, // Adjust the distance for links
            enable: true, // Enable links
            frequency: 1,
            opacity: 0.2, // Subtle connections
            shadow: {
                blur: 5,
                color: {
                    value: "#000"
                },
                enable: false
            },
            triangles: {
                enable: false,
                frequency: 1
            },
            width: 1,
            warp: false
        },
        move: {
            speed: 2, // Lower the speed
            angle: {
                offset: 0,
                value: 90
            },
            attract: {
                distance: 200,
                enable: false,
                rotate: {
                    x: 3000,
                    y: 3000
                }
            },
            center: {
                x: 50,
                y: 50,
                mode: "percent",
                radius: 0
            },
            decay: 0,
            distance: {},
            direction: "none",
            drift: 0,
            enable: true,
            gravity: {
                acceleration: 9.81,
                enable: false,
                inverse: false,
                maxSpeed: 4
            },
            path: {
                clamp: true,
                delay: {
                    value: 0
                },
                enable: false,
                options: {}
            },
            outModes: {
                default: "out",
                bottom: "out",
                left: "out",
                right: "out",
                top: "out"
            },
            random: false,
            size: false,
            spin: {
                acceleration: 0,
                enable: false
            },
            straight: false,
            trail: {
                enable: false,
                length: 10,
                fill: {}
            },
            vibrate: false,
            warp: false
        },
        bounce: {
            horizontal: {
                value: 1
            },
            vertical: {
                value: 1
            }
        },
        collisions: {
            absorb: {
                speed: 2
            },
            bounce: {
                horizontal: {
                    value: 1
                },
                vertical: {
                    value: 1
                }
            },
            enable: true,
            maxSpeed: 2,
            mode: "bounce",
            overlap: {
                enable: true,
                retries: 0
            }
        },
        color: {
            value: theme === "dark"
                ? ["#ff2600", "#008cff", "#00ff00", "#00f7ff", "#ffff00"] // Colors for dark theme
                : ["rgba(255, 38, 0, 0.5)", "rgba(0, 140, 255, 0.5)", "rgba(0, 255, 0, 0.5)", "rgba(0, 247, 255, 0.5)", "rgba(255, 255, 0, 0.5)"], // Colors with lower opacity for light theme
            animation: {
                h: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0
                },
                s: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0
                },
                l: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0
                }
            }
        },
        reduceDuplicates: false,
        shadow: {
            blur: 0,
            color: {
                value: "#000"
            },
            enable: false,
            offset: {
                x: 0,
                y: 0
            }
        },
        shape: {
            close: true,
            fill: true,
            options: {},
            type: "circle"
        },
        zIndex: {
            value: 0,
            opacityRate: 1,
            sizeRate: 1,
            velocityRate: 1
        },
        destroy: {
            bounds: {},
            mode: "none",
            split: {
                count: 1,
                factor: {
                    value: 3
                },
                rate: {
                    value: {
                        min: 4,
                        max: 9
                    }
                },
                sizeOffset: true,
                particles: {}
            }
        },
        roll: {
            darken: {
                enable: false,
                value: 0
            },
            enable: false,
            enlighten: {
                enable: false,
                value: 0
            },
            mode: "vertical",
            speed: 4
        },
        tilt: {
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: false
            },
            direction: "clockwise",
            enable: false
        },
        twinkle: {
            lines: {
                enable: false,
                frequency: 0.05,
                opacity: 1
            },
            particles: {
                enable: false,
                frequency: 0.05,
                opacity: 1
            }
        },
        wobble: {
            distance: 5,
            enable: false,
            speed: {
                angle: 50,
                move: 10
            }
        },
        life: {
            count: 1,
            delay: {
                value: 0,
                sync: false
            },
            duration: {
                value: 25,
                sync: false
            }
        },
        rotate: {
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: false
            },
            direction: "clockwise",
            path: false
        },
        orbit: {
            animation: {
                count: 0,
                enable: false,
                speed: 1,
                decay: 0,
                delay: 0,
                sync: false
            },
            enable: false,
            opacity: 1,
            rotation: {
                value: 45
            },
            width: 1
        },
        repulse: {
            value: 0,
            enabled: false,
            distance: 1,
            duration: 1,
            factor: 1,
            speed: 1
        }
    }
});