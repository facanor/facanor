import OpenSeadragon from "openseadragon";

export const RGB = function (options) {
    OpenSeadragon.extend(
        true,
        this,
        {
            viewer: null,
            onCanvasHover: null,
            sampleSize: 1,
        },
        options
    );

    if (this.onCanvasHover) {
        this.tracker = new OpenSeadragon.MouseTracker({
            element: this.viewer.canvas,
            moveHandler: OpenSeadragon.delegate(this, onMouseMove),
        });
    }
};

OpenSeadragon.extend(RGB.prototype, {
    getValueAt: function (canvasX, canvasY) {
        var center =
            arguments.length === 1 ? canvasX : new OpenSeadragon.Point(canvasX, canvasY);
        var viewer = this.viewer;

        var images = [];
        for (var i = 0; i < viewer.world.getItemCount(); i++) {
            images.push(viewer.world.getItemAt(i));
        }

        var image = viewer.drawer.getImageOfPoint(center, images);

        var sampleData = viewer.drawer.getRgbAt(center);
        var reds = [],
            greens = [],
            blues = [],
            alphas = [];
        for (var s = 0; s < sampleData.length; s = s + 4) {
            reds.push(sampleData[s]);
            greens.push(sampleData[s + 1]);
            blues.push(sampleData[s + 2]);
            alphas.push(sampleData[s + 3]);
        }
        var getMedian = function (channelValues) {
            channelValues.sort(function (a, b) {
                return a - b;
            });
            var median = channelValues[Math.floor(channelValues.length / 2)];
            return median;
        };
        var color = {
            r: getMedian(reds),
            g: getMedian(greens),
            b: getMedian(blues),
            a: getMedian(alphas),
        };
        if (image) {
            color.image = image;
            color.imageCoordinates = center;
        }
        return color;
    },
});

function onMouseMove(event) {
    this.onCanvasHover(this.getValueAt(event.position));
}

OpenSeadragon.Drawer.prototype.getImageOfPoint = function (point, images) {
    var image;
    for (var i = 0; i < images.length; i++) {
        var size = images[i].getContentSize();
        var imagePoint;
        if (OpenSeadragon.TiledImage.prototype.viewerElementToImageCoordinates) {
            imagePoint = images[i].viewerElementToImageCoordinates(point);
        } else {
            // older version
            imagePoint = this.viewer.viewport.viewerElementToImageCoordinates(point);
        }
        var pointIsInImage = imagePoint.x >= 0 && imagePoint.y >= 0;
        pointIsInImage =
            pointIsInImage && imagePoint.x <= size.x && imagePoint.y <= size.y;
        if (pointIsInImage) {
            image = images[i];
            break;
        }
    }
    return image;
};

OpenSeadragon.Drawer.prototype.getRgbAt = function (point) {
    if (!this.useCanvas) {
        return false;
    }
    var sampleSize = this.viewer.rgbInstance.sampleSize;
    var sampleOffset = (sampleSize - 1) / 2;
    var ratio = OpenSeadragon.pixelDensityRatio;
    var x = point.x * ratio - sampleOffset;
    var y = point.y * ratio - sampleOffset;
    var renderingContext = this._getContext();
    var sampleData = renderingContext.getImageData(x, y, sampleSize, sampleSize).data; // rgba e [0,255]
    return sampleData;
};
