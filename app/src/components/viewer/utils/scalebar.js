import OpenSeadragon from "openseadragon";

OpenSeadragon.ScalebarType = {
    NONE: 0,
    MICROSCOPY: 1,
    MAP: 2,
};

OpenSeadragon.ScalebarLocation = {
    NONE: 0,
    TOP_LEFT: 1,
    TOP_RIGHT: 2,
    BOTTOM_RIGHT: 3,
    BOTTOM_LEFT: 4,
};

OpenSeadragon.ScalebarSizeAndTextRenderer = {
    METRIC_LENGTH: function (ppm, minSize) {
        return getScalebarSizeAndTextForMetric(ppm, minSize, "m");
    },
    IMPERIAL_LENGTH: function (ppm, minSize) {
        var maxSize = minSize * 2;
        var ppi = ppm * 0.0254;
        if (maxSize < ppi * 12) {
            if (maxSize < ppi) {
                var ppt = ppi / 1000;
                return getScalebarSizeAndText(ppt, minSize, "th");
            }
            return getScalebarSizeAndText(ppi, minSize, "in");
        }
        var ppf = ppi * 12;
        if (maxSize < ppf * 2000) {
            return getScalebarSizeAndText(ppf, minSize, "ft");
        }
        var ppmi = ppf * 5280;
        return getScalebarSizeAndText(ppmi, minSize, "mi");
    },
    ASTRONOMY: function (ppa, minSize) {
        var maxSize = minSize * 2;
        if (maxSize < ppa * 60) {
            return getScalebarSizeAndText(ppa, minSize, '"', false, "");
        }
        var ppminutes = ppa * 60;
        if (maxSize < ppminutes * 60) {
            return getScalebarSizeAndText(ppminutes, minSize, "'", false, "");
        }
        var ppd = ppminutes * 60;
        return getScalebarSizeAndText(ppd, minSize, "&#176", false, "");
    },
    STANDARD_TIME: function (pps, minSize) {
        var maxSize = minSize * 2;
        if (maxSize < pps * 60) {
            return getScalebarSizeAndTextForMetric(pps, minSize, "s", false);
        }
        var ppminutes = pps * 60;
        if (maxSize < ppminutes * 60) {
            return getScalebarSizeAndText(ppminutes, minSize, "minute", true);
        }
        var pph = ppminutes * 60;
        if (maxSize < pph * 24) {
            return getScalebarSizeAndText(pph, minSize, "hour", true);
        }
        var ppd = pph * 24;
        if (maxSize < ppd * 365.25) {
            return getScalebarSizeAndText(ppd, minSize, "day", true);
        }
        var ppy = ppd * 365.25;
        return getScalebarSizeAndText(ppy, minSize, "year", true);
    },
};

function getScalebarSizeAndText(ppm, minSize, unitSuffix, handlePlural, spacer) {
    spacer = spacer === undefined ? " " : spacer;
    var value = normalize(ppm, minSize);
    var factor = roundSignificand((value / ppm) * minSize, 3);
    var size = value * minSize;
    var plural = handlePlural && factor > 1 ? "s" : "";
    return {
        size: size,
        text: factor + spacer + unitSuffix + plural,
    };
}

function getScalebarSizeAndTextForMetric(ppm, minSize, unitSuffix) {
    var value = normalize(ppm, minSize);
    var factor = roundSignificand((value / ppm) * minSize, 3);
    var size = value * minSize;
    var valueWithUnit = getWithUnit(factor, unitSuffix);
    return {
        size: size,
        text: valueWithUnit,
    };
}

function normalize(value, minSize) {
    var significand = getSignificand(value);
    var minSizeSign = getSignificand(minSize);
    var result = getSignificand(significand / minSizeSign);
    if (result >= 5) {
        result /= 5;
    }
    if (result >= 4) {
        result /= 4;
    }
    if (result >= 2) {
        result /= 2;
    }
    return result;
}

function getSignificand(x) {
    return x * Math.pow(10, Math.ceil(-log10(x)));
}

function roundSignificand(x, decimalPlaces) {
    var exponent = -Math.ceil(-log10(x));
    var power = decimalPlaces - exponent;
    var significand = x * Math.pow(10, power);
    if (power < 0) {
        return Math.round(significand) * Math.pow(10, -power);
    }
    return Math.round(significand) / Math.pow(10, power);
}

function log10(x) {
    return Math.log(x) / Math.log(10);
}

function getWithUnit(value, unitSuffix) {
    if (value < 0.000001) {
        return value * 1000000000 + " n" + unitSuffix;
    }
    if (value < 0.001) {
        return value * 1000000 + " μ" + unitSuffix;
    }
    if (value < 1) {
        return value * 1000 + " m" + unitSuffix;
    }
    if (value >= 1000) {
        return value / 1000 + " k" + unitSuffix;
    }
    return value + " " + unitSuffix;
}

function isDefined(variable) {
    return typeof variable !== "undefined";
}

function tiledImageViewportToImageZoom(tiledImage, viewportZoom) {
    var ratio =
        (tiledImage._scaleSpring.current.value *
            tiledImage.viewport._containerInnerSize.x) /
        tiledImage.source.dimensions.x;
    return ratio * viewportZoom;
}

function refresh(object) {
    if (
        !object.viewer.isOpen() ||
        !object.drawScalebar ||
        !object.pixelsPerMeter ||
        !object.location
    ) {
        object.divElt.style.display = "none";
        return;
    }
    object.divElt.style.display = "";

    var viewport = object.viewer.viewport;
    var tiledImage = object.viewer.world.getItemAt(object.referenceItemIdx);
    var zoom = tiledImageViewportToImageZoom(tiledImage, viewport.getZoom(true));
    var currentPPM = zoom * object.pixelsPerMeter;
    var props = object.sizeAndTextRenderer(currentPPM, object.minWidth);

    object.drawScalebar(props.size, props.text);
    var location = getScalebarLocation(object);
    object.divElt.style.left = location.x + "px";
    object.divElt.style.top = location.y + "px";
}

function getScalebarLocation(object) {
    var x = null;
    var y = null;
    var pixel = null;
    var barWidth = null;
    var barHeight = null;
    var container = null;
    if (object.location === OpenSeadragon.ScalebarLocation.TOP_LEFT) {
        x = 0;
        y = 0;
        if (object.stayInsideImage) {
            pixel = object.viewer.viewport.pixelFromPoint(
                new OpenSeadragon.Point(0, 0),
                true
            );
            if (!object.viewer.wrapHorizontal) {
                x = Math.max(pixel.x, 0);
            }
            if (!object.viewer.wrapVertical) {
                y = Math.max(pixel.y, 0);
            }
        }
        return new OpenSeadragon.Point(x + object.xOffset, y + object.yOffset);
    }
    if (object.location === OpenSeadragon.ScalebarLocation.TOP_RIGHT) {
        barWidth = object.divElt.offsetWidth;
        container = object.viewer.container;
        x = container.offsetWidth - barWidth;
        y = 0;
        if (object.stayInsideImage) {
            pixel = object.viewer.viewport.pixelFromPoint(
                new OpenSeadragon.Point(1, 0),
                true
            );
            if (!object.viewer.wrapHorizontal) {
                x = Math.min(x, pixel.x - barWidth);
            }
            if (!object.viewer.wrapVertical) {
                y = Math.max(y, pixel.y);
            }
        }
        return new OpenSeadragon.Point(x - object.xOffset, y + object.yOffset);
    }
    if (object.location === OpenSeadragon.ScalebarLocation.BOTTOM_RIGHT) {
        barWidth = object.divElt.offsetWidth;
        barHeight = object.divElt.offsetHeight;
        container = object.viewer.container;
        x = container.offsetWidth - barWidth;
        y = container.offsetHeight - barHeight;
        if (object.stayInsideImage) {
            pixel = object.viewer.viewport.pixelFromPoint(
                new OpenSeadragon.Point(1, 1 / object.viewer.source.aspectRatio),
                true
            );
            if (!object.viewer.wrapHorizontal) {
                x = Math.min(x, pixel.x - barWidth);
            }
            if (!object.viewer.wrapVertical) {
                y = Math.min(y, pixel.y - barHeight);
            }
        }
        return new OpenSeadragon.Point(x - object.xOffset, y - object.yOffset);
    }
    if (object.location === OpenSeadragon.ScalebarLocation.BOTTOM_LEFT) {
        barHeight = object.divElt.offsetHeight;
        container = object.viewer.container;
        x = 0;
        y = container.offsetHeight - barHeight;
        if (object.stayInsideImage) {
            pixel = object.viewer.viewport.pixelFromPoint(
                new OpenSeadragon.Point(0, 1 / object.viewer.source.aspectRatio),
                true
            );
            if (!object.viewer.wrapHorizontal) {
                x = Math.max(x, pixel.x);
            }
            if (!object.viewer.wrapVertical) {
                y = Math.min(y, pixel.y - barHeight);
            }
        }
        return new OpenSeadragon.Point(x + object.xOffset, y - object.yOffset);
    }
}

export const Scalebar = function (options) {
    options = options || {};
    if (!options.viewer) {
        throw new Error("A viewer must be specified.");
    }
    this.viewer = options.viewer;

    this.divElt = document.createElement("div");
    this.viewer.container.appendChild(this.divElt);
    this.divElt.style.position = "relative";
    this.divElt.style.margin = "0";
    this.divElt.style.pointerEvents = "none";

    this.divElt.style.width = options.minWidth || "150px";
    this.divElt.style.display = "";
    this.minWidth = this.divElt.offsetWidth;

    let type = options.type || OpenSeadragon.ScalebarType.MICROSCOPY;

    if (!type) {
        this.drawScalebar = null;
    } else if (type === OpenSeadragon.ScalebarType.MAP) {
        this.drawScalebar = function (size, text) {
            this.divElt.style.fontSize = this.fontSize;
            this.divElt.style.fontFamily = this.fontFamily;
            this.divElt.style.textAlign = "center";
            this.divElt.style.color = this.fontColor;
            this.divElt.style.border = this.barThickness + "px solid " + this.color;
            this.divElt.style.borderTop = "none";
            this.divElt.style.backgroundColor = this.backgroundColor;
            this.divElt.innerHTML = text;
            this.divElt.style.width = size + "px";
        };
    } else {
        this.drawScalebar = function (size, text) {
            this.divElt.style.fontSize = this.fontSize;
            this.divElt.style.fontFamily = this.fontFamily;
            this.divElt.style.textAlign = "center";
            this.divElt.style.color = this.fontColor;
            this.divElt.style.border = "none";
            this.divElt.style.borderBottom = this.barThickness + "px solid " + this.color;
            this.divElt.style.backgroundColor = this.backgroundColor;
            this.divElt.innerHTML = text;
            this.divElt.style.width = size + "px";
        };
    }

    this.color = options.color || "black";
    this.fontColor = options.fontColor || "black";
    this.backgroundColor = options.backgroundColor || "none";
    this.fontSize = options.fontSize || "";
    this.fontFamily = options.fontFamily || "";
    this.barThickness = options.barThickness || 2;
    this.pixelsPerMeter = options.pixelsPerMeter || null;
    this.referenceItemIdx = options.referenceItemIdx || 0;
    this.location = options.location || OpenSeadragon.ScalebarLocation.BOTTOM_LEFT;
    this.xOffset = options.xOffset || 5;
    this.yOffset = options.yOffset || 5;
    this.stayInsideImage = isDefined(options.stayInsideImage)
        ? options.stayInsideImage
        : true;
    this.sizeAndTextRenderer =
        options.sizeAndTextRenderer ||
        OpenSeadragon.ScalebarSizeAndTextRenderer.METRIC_LENGTH;

    var self = this;
    this.viewer.addHandler("open", function () {
        refresh(self);
    });
    this.viewer.addHandler("animation", function () {
        refresh(self);
    });
    this.viewer.addHandler("resize", function () {
        refresh(self);
    });
};
