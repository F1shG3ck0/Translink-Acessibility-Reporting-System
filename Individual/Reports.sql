--SQL View - Vehicle Accessibility Classification
CREATE VIEW vw_vehicle_accessibility AS
SELECT
    v.vehicleId,
    v.vehicleType,
    CASE
        WHEN
            SUM(CASE WHEN LOWER(f.featureName) LIKE '%ramp%' THEN 1 ELSE 0 END) > 0
        AND
            SUM(
                CASE
                    WHEN LOWER(f.featureName) LIKE '%wheel%'
                     AND LOWER(f.featureName) LIKE '%space%'
                    THEN 1
                    ELSE 0
                END
            ) > 0
            THEN 'Boarding & Onboard Access'

        WHEN
            SUM(CASE WHEN LOWER(f.featureName) LIKE '%ramp%' THEN 1 ELSE 0 END) > 0
            THEN 'Boarding Access Only'

        WHEN
            SUM(
                CASE
                    WHEN LOWER(f.featureName) LIKE '%wheel%'
                     AND LOWER(f.featureName) LIKE '%space%'
                    THEN 1
                    ELSE 0
                END
            ) > 0
            THEN 'Onboard Accommodation Only'

        ELSE 'No Accessibility Features'
    END AS accessibilityStatus
    FROM tblVehicle v
    LEFT JOIN tblVehicleFeature vf
        ON v.vehicleId = vf.vehicleId
    LEFT JOIN tblFeature f
        ON vf.featureId = f.featureId
        AND f.featureCategory = 'Vehicle'
    GROUP BY v.vehicleId, v.vehicleType;

-- Report Title: Routes with Hospital Serving Stops
-- Business Question: How many transport routes include at least one stop serving a hospital?
-- Why this report is useful: dentifies reliance on a limited number of routes for hospital access and highlights opportunities to improve healthcare connectivity.
-- Tables used: tblRoute, tblRouteStop, tblStopFeature, tblFeature, tblStop

SELECT
        r.routeId,    
        r.routeName,
        r.startLocation,
        r.endLocation,
        GROUP_CONCAT(DISTINCT s.stopName ORDER BY s.stopName SEPARATOR ', ') AS hospitalStops,
        COUNT(DISTINCT s.stopId) AS hospitalStopCount
    FROM tblRoute r
    JOIN tblRouteStop rs
        ON r.routeId = rs.routeId
    JOIN tblStopFeature sf
        ON rs.stopId = sf.stopId
    JOIN tblStop s
        ON rs.stopId = s.stopId
    JOIN tblFeature f
        ON sf.featureId = f.featureId
    WHERE LOWER(f.featureName) LIKE '%hospital%'
    AND f.featureCategory = 'Stop'
    GROUP BY
        r.routeId,
        r.routeName,
        r.startLocation,
        r.endLocation
    ORDER BY hospitalStopCount DESC, r.routeName;

-- Report Title: Accessibility Features Available at Each Stop
-- Business Question: What accessibility‑related features are available at each stop across the network?
-- Why this report is useful: Supports identification of stops lacking inclusive infrastructure and prioritisation of accessibility improvements.
-- Tables used: tblStop, tblFeature, tblStopFeature

SELECT 
        s.stopName,
        GROUP_CONCAT(f.featureName ORDER BY f.featureName SEPARATOR ', ') AS accessibilityFeatures,
        COUNT(f.featureId) AS accessibilityFeatureCount
    FROM tblStop s
    LEFT JOIN tblStopFeature sf ON s.stopId = sf.stopId
    LEFT JOIN tblFeature f
        ON sf.featureId = f.featureId
        AND f.featureCategory = 'Stop'
    GROUP BY s.stopId, s.stopName
    ORDER BY accessibilityFeatureCount DESC;


-- Report Title: Vehicle Wheelchair Accessibility Coverage
-- Business Question: What percentage of vehicles provide wheelchair accessibility?
-- Why this report is useful: Helps assess accessibility provision across the transport fleet indicating where future improvements could be made.
-- Tables used: vw_vehicle_accessibility


SELECT
    accessibilityStatus,
    COUNT(*) AS vehicleCount,
    ROUND(
        (COUNT(*) / (SELECT COUNT(*) FROM vw_vehicle_accessibility)) * 100,
        2
    ) AS percentageOfFleet
    FROM vw_vehicle_accessibility
    GROUP BY accessibilityStatus
    ORDER BY vehicleCount DESC;



