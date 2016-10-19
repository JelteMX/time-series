
import * as React from "TimeSeries/lib/react";

import { NVD3LineChart } from "./nvd3-linechart";
import { format, time } from "TimeSeries/lib/d3";

import { ModelProps, SeriesConfig } from "../../TimeSeries.d";

export interface DataPoint {
    x: number;
    y: number;
}
export interface DataSerie {
    data: DataPoint[];
}
export interface DataStore {
    series: any;
}

export interface Series {
    values?: DataPoint[];
    key?: any;
    color?: string;
    isArea?: boolean;
}

export interface WidgetProps extends ModelProps {
    widgetId: string;
    seriesData?: Series[];
    dataLoaded?: boolean;
    dataStore?: DataStore;
}

export class TimeSeries extends React.Component<WidgetProps, {}> {

    public constructor(props: WidgetProps) {
        super(props);

        this.getDatum = this.getDatum.bind(this);
    }

    public componentWillMount() {
        this.checkConfig();
    }

    private checkConfig() {
        // TODO add validation on config if needed.
    }

    public render() {
        const props = this.props;
        const datum = this.getDatum(props.seriesConfig, props.dataStore);
        const xFormat = props.xAxisFormat ? props.xAxisFormat : "%d-%b-%y";
        const yFormat = props.yAxisFormat ? props.yAxisFormat : "";
        if (props.dataLoaded) {
            return React.createElement(NVD3LineChart, {
                chartProps: {
                    xAxis: {
                        axisLabel: props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: (dataPoint: any) => {
                            return time.format(xFormat)(new Date(dataPoint));
                        }
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: (dataPoint: any) => {
                            if (yFormat) {
                                return format(yFormat)(dataPoint);
                            } else {
                                return dataPoint;
                            }
                        }
                    }
                },
                datum,
                height: props.height,
                width: props.width
            });
        } else {
            return (<div>Loading ...</div>);
        }
    }

    private getDatum(seriesConfig: SeriesConfig[], dataStore: DataStore): Series[] {
        return this.props.seriesConfig.map(serieConfig => ({
            area: serieConfig.seriesFill,
            color: serieConfig.seriesColor ? serieConfig.seriesColor : undefined,
            key: serieConfig.seriesKey,
            values: dataStore.series[serieConfig.seriesKey].data
        }));
    }
}
